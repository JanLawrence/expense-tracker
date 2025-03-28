const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, middleName, lastName, contactNo } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.userAuth.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user and auth in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          firstName,
          middleName,
          lastName,
          contactNo,
          startingMoney: 0
        }
      });
      
      // Create auth record
      const auth = await tx.userAuth.create({
        data: {
          email,
          password: hashedPassword,
          salt,
          userId: user.id,
          verificationToken: crypto.randomBytes(32).toString('hex')
        }
      });
      
      // Create default cash payment mode
      await tx.paymentMode.create({
        data: {
          userId: user.id,
          type: 'CASH',
          name: 'Cash',
          color: '#4CAF50'
        }
      });
      
      return { user, auth };
    });
    
    // Send verification email (in a real app)
    // await authService.sendVerificationEmail(result.auth.email, result.auth.verificationToken);
    
    res.status(201).json({ 
      message: 'User registered successfully. Please verify your email.',
      userId: result.user.id
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const auth = await prisma.userAuth.findUnique({
      where: { email },
      include: { user: true }
    });
    
    if (!auth) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, auth.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: auth.userId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Update last login time
    await prisma.userAuth.update({
      where: { id: auth.id },
      data: { lastLogin: new Date() }
    });
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: auth.user.id,
        firstName: auth.user.firstName,
        lastName: auth.user.lastName,
        email: auth.email
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const auth = await prisma.userAuth.findUnique({
      where: { email }
    });
    
    if (!auth) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
    
    await prisma.userAuth.update({
      where: { id: auth.id },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiry
      }
    });
    
    // Send password reset email (in a real app)
    // await authService.sendPasswordResetEmail(email, resetToken);
    
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    const auth = await prisma.userAuth.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });
    
    if (!auth) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Generate new salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await prisma.userAuth.update({
      where: { id: auth.id },
      data: {
        password: hashedPassword,
        salt,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const auth = await prisma.userAuth.findFirst({
      where: { verificationToken: token }
    });
    
    if (!auth) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    
    await prisma.userAuth.update({
      where: { id: auth.id },
      data: {
        isEmailVerified: true,
        verificationToken: null
      }
    });
    
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};