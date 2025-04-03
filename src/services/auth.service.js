const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generate JWT token for a user
 * @param {number} userId User ID to include in token
 * @returns {string} JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Verify if a password matches the stored hash
 * @param {string} password Plain text password
 * @param {string} hashedPassword Stored password hash
 * @returns {Promise<boolean>} Whether password matches
 */
exports.verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Hash a password with a new salt
 * @param {string} password Plain text password to hash
 * @returns {Promise<{hash: string, salt: string}>} Hashed password and salt
 */
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
};

/**
 * Send verification email to user (placeholder)
 * In a real application, this would send an actual email
 * @param {string} email User's email
 * @param {string} token Verification token
 */
exports.sendVerificationEmail = async (email, token) => {
  // This is a placeholder. In a real app, you would integrate with an
  // email service like SendGrid, Mailgun, etc.
  console.log(`Sending verification email to ${email} with token ${token}`);
  
  // Example implementation with a real email service would be:
  // await emailClient.send({
  //   to: email,
  //   subject: 'Verify your account',
  //   text: `Please verify your account by clicking this link: ${process.env.FRONTEND_URL}/verify/${token}`,
  //   html: `<p>Please verify your account by clicking <a href="${process.env.FRONTEND_URL}/verify/${token}">this link</a></p>`
  // });
  
  return true; // Assume success for now
};

/**
 * Send password reset email (placeholder)
 * @param {string} email User's email
 * @param {string} token Reset token
 */
exports.sendPasswordResetEmail = async (email, token) => {
  // Placeholder for email sending logic
  console.log(`Sending password reset email to ${email} with token ${token}`);
  
  // Example implementation:
  // await emailClient.send({
  //   to: email,
  //   subject: 'Reset your password',
  //   text: `Reset your password by clicking this link: ${process.env.FRONTEND_URL}/reset-password/${token}`,
  //   html: `<p>Reset your password by clicking <a href="${process.env.FRONTEND_URL}/reset-password/${token}">this link</a></p>`
  // });
  
  return true;
};

/**
 * Find a user by email
 * @param {string} email User's email
 * @returns {Promise<Object|null>} User object or null
 */
exports.findUserByEmail = async (email) => {
  return prisma.userAuth.findUnique({
    where: { email },
    include: { user: true }
  });
};

/**
 * Create a new user with authentication
 * @param {Object} userData User profile data
 * @param {Object} authData Authentication data
 * @returns {Promise<Object>} Created user
 */
exports.createUser = async (userData, authData) => {
  // Hash the password
  const { hash, salt } = await this.hashPassword(authData.password);
  
  // Create user and authentication in transaction
  return prisma.$transaction(async (tx) => {
    // Create user profile
    const user = await tx.user.create({
      data: userData
    });
    
    // Create authentication record
    const auth = await tx.userAuth.create({
      data: {
        userId: user.id,
        email: authData.email,
        password: hash,
        salt,
        verificationToken: authData.verificationToken
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
};