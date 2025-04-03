const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPaymentModes = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    const paymentModes = await prisma.paymentMode.findMany({
      where: {
        userId,
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json(paymentModes);
  } catch (error) {
    next(error);
  }
};

exports.getPaymentModeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    const paymentMode = await prisma.paymentMode.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      }
    });
    
    if (!paymentMode) {
      return res.status(404).json({ message: 'Payment mode not found' });
    }
    
    res.status(200).json(paymentMode);
  } catch (error) {
    next(error);
  }
};

exports.createPaymentMode = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { type, name, creditLimit, cutoffDate, network, color } = req.body;
    
    // Check if payment mode with same name exists for this user
    const existingPaymentMode = await prisma.paymentMode.findFirst({
      where: {
        userId,
        name,
        deletedAt: null
      }
    });
    
    if (existingPaymentMode) {
      return res.status(400).json({ message: 'Payment mode with this name already exists' });
    }
    
    const paymentMode = await prisma.paymentMode.create({
      data: {
        userId,
        type,
        name,
        creditLimit: creditLimit ? parseFloat(creditLimit) : null,
        cutoffDate: cutoffDate ? new Date(cutoffDate) : null,
        network,
        color
      }
    });
    
    res.status(201).json({
      message: 'Payment mode created successfully',
      paymentMode
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePaymentMode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, name, creditLimit, cutoffDate, network, color } = req.body;
    
    // Check if payment mode exists and belongs to user
    const existingPaymentMode = await prisma.paymentMode.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      }
    });
    
    if (!existingPaymentMode) {
      return res.status(404).json({ message: 'Payment mode not found' });
    }
    
    // Check for name conflicts if name is changing
    if (name !== existingPaymentMode.name) {
      const nameConflict = await prisma.paymentMode.findFirst({
        where: {
          userId,
          name,
          deletedAt: null,
          id: {
            not: parseInt(id)
          }
        }
      });
      
      if (nameConflict) {
        return res.status(400).json({ message: 'Payment mode with this name already exists' });
      }
    }
    
    // Prevent changing default Cash payment mode
    if (existingPaymentMode.type === 'CASH' && existingPaymentMode.name === 'Cash' && 
        (type !== 'CASH' || name !== 'Cash')) {
      return res.status(400).json({ message: 'Cannot change the type or name of the default Cash payment mode' });
    }
    
    const updatedPaymentMode = await prisma.paymentMode.update({
      where: { id: parseInt(id) },
      data: {
        type: type || undefined,
        name: name || undefined,
        creditLimit: creditLimit !== undefined ? parseFloat(creditLimit) : undefined,
        cutoffDate: cutoffDate ? new Date(cutoffDate) : undefined,
        network: network !== undefined ? network : undefined,
        color: color || undefined
      }
    });
    
    res.status(200).json({
      message: 'Payment mode updated successfully',
      paymentMode: updatedPaymentMode
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePaymentMode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    // Check if payment mode exists and belongs to user
    const existingPaymentMode = await prisma.paymentMode.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      }
    });
    
    if (!existingPaymentMode) {
      return res.status(404).json({ message: 'Payment mode not found' });
    }
    
    // Check if this is the default cash payment mode
    if (existingPaymentMode.type === 'CASH' && existingPaymentMode.name === 'Cash') {
      return res.status(400).json({ message: 'Cannot delete the default Cash payment mode' });
    }
    
    // Check if payment mode is in use
    const expensesUsingPaymentMode = await prisma.expense.count({
      where: {
        paymentModeId: parseInt(id),
        deletedAt: null
      }
    });
    
    if (expensesUsingPaymentMode > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete payment mode that is in use. Please update or delete associated expenses first.',
        expenseCount: expensesUsingPaymentMode
      });
    }
    
    // Soft delete
    await prisma.paymentMode.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });
    
    res.status(200).json({ message: 'Payment mode deleted successfully' });
  } catch (error) {
    next(error);
  }
};