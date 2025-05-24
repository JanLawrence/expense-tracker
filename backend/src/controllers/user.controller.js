const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        countryCode: true,
        contactNo: true,
        startingMoney: true,
        income: true,
        paySchedule: true,
        avatar: true,
        createdAt: true,
        auth: {
          select: {
            email: true,
            isEmailVerified: true,
            lastLogin: true
          }
        },
        _count: {
          select: {
            paymentMode: {
              where: {
                deletedAt: null // Only count non-deleted payment modes
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { firstName, middleName, lastName, countryCode, income, paySchedule, avatar } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        firstName: firstName || undefined,
        middleName: middleName || undefined,
        lastName: lastName || undefined,
        contactNo: contactNo || undefined,
        countryCode: countryCode || undefined,
        income: income !== undefined ? parseFloat(income) : undefined,
        paySchedule: paySchedule || undefined,
        avatar: avatar || undefined
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        contactNo: true,
        countryCode: true,
        startingMoney: true,
        income: true,
        paySchedule: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newEmail, password } = req.body;
    
    // Verify current password first
    const auth = await prisma.userAuth.findUnique({
      where: {
        userId
      }
    });
    
    if (!auth) {
      return res.status(404).json({ message: 'User authentication not found' });
    }
    
    const isMatch = await bcrypt.compare(password, auth.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Check if email is already in use
    const emailExists = await prisma.userAuth.findUnique({
      where: {
        email: newEmail
      }
    });
    
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Update email and reset verification status
    await prisma.userAuth.update({
      where: {
        userId
      },
      data: {
        email: newEmail,
        isEmailVerified: false,
        verificationToken
      }
    });
    
    // Send verification email (in a real app)
    // await authService.sendVerificationEmail(newEmail, verificationToken);
    
    res.status(200).json({
      message: 'Email updated successfully. Please verify your new email address.'
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const auth = await prisma.userAuth.findUnique({
      where: {
        userId
      }
    });
    
    if (!auth) {
        return res.status(404).json({ message: 'User authentication not found' });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, auth.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Generate new salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password
      await prisma.userAuth.update({
        where: {
          userId
        },
        data: {
          password: hashedPassword,
          salt
        }
      });
      
      res.status(200).json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.updateStartingMoney = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { startingMoney } = req.body;
      
      if (typeof startingMoney !== 'number' && typeof parseFloat(startingMoney) !== 'number') {
        return res.status(400).json({ message: 'Starting money must be a valid number' });
      }
      
      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          startingMoney: parseFloat(startingMoney)
        }
      });
      
      res.status(200).json({
        message: 'Starting money updated successfully',
        startingMoney: updatedUser.startingMoney
      });
    } catch (error) {
      next(error);
    }
  };
  
  exports.deleteAccount = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { password } = req.body;
      
      // Verify password first
      const auth = await prisma.userAuth.findUnique({
        where: {
          userId
        }
      });
      
      if (!auth) {
        return res.status(404).json({ message: 'User authentication not found' });
      }
      
      const isMatch = await bcrypt.compare(password, auth.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Password is incorrect' });
      }
      
      // Start transaction for account deletion
      await prisma.$transaction(async (tx) => {
        // Soft delete all user's payment modes
        await tx.paymentMode.updateMany({
          where: {
            userId,
            deletedAt: null
          },
          data: {
            deletedAt: new Date()
          }
        });
        
        // Soft delete all user's expenses
        await tx.expense.updateMany({
          where: {
            userId,
            deletedAt: null
          },
          data: {
            deletedAt: new Date()
          }
        });
        
        // Soft delete auth
        await tx.userAuth.update({
          where: {
            userId
          },
          data: {
            deletedAt: new Date()
          }
        });
        
        // Soft delete user
        await tx.user.update({
          where: {
            id: userId
          },
          data: {
            deletedAt: new Date()
          }
        });
      });
      
      res.status(200).json({
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };