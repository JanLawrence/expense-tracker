const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllExpenses = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, sort = 'date', order = 'desc' } = req.query;
    
    const skip = (page - 1) * parseInt(limit);
    
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        deletedAt: null
      },
      include: {
        category: true,
        paymentMode: true
      },
      orderBy: {
        [sort]: order
      },
      skip,
      take: parseInt(limit)
    });
    
    const total = await prisma.expense.count({
      where: {
        userId,
        deletedAt: null
      }
    });
    
    res.status(200).json({
      expenses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    const expense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      },
      include: {
        category: true,
        paymentMode: true
      }
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const {
      categoryId,
      paymentModeId,
      description,
      amount,
      date,
      isShared,
      shareAmount,
      isPaidShared,
      remarks,
      isRecurring,
      recurringStartDate,
      recurringEndDate,
      recurringFrequency,
      showOnReport
    } = req.body;
    
    const expense = await prisma.expense.create({
      data: {
        userId,
        categoryId: parseInt(categoryId),
        paymentModeId: parseInt(paymentModeId),
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        isShared: isShared || false,
        shareAmount: isShared ? parseFloat(shareAmount) : null,
        isPaidShared: isPaidShared || false,
        remarks,
        isRecurring: isRecurring || false,
        recurringStartDate: recurringStartDate ? new Date(recurringStartDate) : null,
        recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
        recurringFrequency,
        showOnReport: showOnReport !== undefined ? showOnReport : true
      }
    });
    
    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const {
      categoryId,
      paymentModeId,
      description,
      amount,
      date,
      isShared,
      shareAmount,
      isPaidShared,
      remarks,
      isRecurring,
      recurringStartDate,
      recurringEndDate,
      recurringFrequency,
      showOnReport
    } = req.body;
    
    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      }
    });
    
    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Update expense
    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        paymentModeId: paymentModeId ? parseInt(paymentModeId) : undefined,
        description: description || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        isShared: isShared !== undefined ? isShared : undefined,
        shareAmount: isShared && shareAmount ? parseFloat(shareAmount) : undefined,
        isPaidShared: isPaidShared !== undefined ? isPaidShared : undefined,
        remarks: remarks !== undefined ? remarks : undefined,
        isRecurring: isRecurring !== undefined ? isRecurring : undefined,
        recurringStartDate: recurringStartDate ? new Date(recurringStartDate) : undefined,
        recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : undefined,
        recurringFrequency: recurringFrequency || undefined,
        showOnReport: showOnReport !== undefined ? showOnReport : undefined
      }
    });
    
    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id: parseInt(id),
        userId,
        deletedAt: null
      }
    });
    
    if (!existingExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    // Soft delete by setting deletedAt
    await prisma.expense.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });
    
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getExpensesByCategory = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    const expensesByCategory = await prisma.$queryRaw`
      SELECT 
        c.id, 
        c.name, 
        SUM(e.amount) as total,
        COUNT(*) as count
      FROM "Expense" e
      JOIN "Category" c ON e."categoryId" = c.id
      WHERE e."userId" = ${userId} 
        AND e."deletedAt" IS NULL
        AND e."showOnReport" = true
      GROUP BY c.id, c.name
      ORDER BY total DESC
    `;
    
    res.status(200).json(expensesByCategory);
  } catch (error) {
    next(error);
  }
};

exports.getExpensesByPaymentMode = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    const expensesByPaymentMode = await prisma.$queryRaw`
      SELECT 
        p.id, 
        p.name,
        p.type,
        SUM(e.amount) as total,
        COUNT(*) as count
      FROM "Expense" e
      JOIN "PaymentMode" p ON e."paymentModeId" = p.id
      WHERE e."userId" = ${userId} 
        AND e."deletedAt" IS NULL
        AND e."showOnReport" = true
      GROUP BY p.id, p.name, p.type
      ORDER BY total DESC
    `;
    
    res.status(200).json(expensesByPaymentMode);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlySummary = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { year } = req.query;
    
    const currentYear = year || new Date().getFullYear();
    
    const monthlySummary = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM e.date) as month,
        SUM(e.amount) as total
      FROM "Expense" e
      WHERE e."userId" = ${userId}
        AND e."deletedAt" IS NULL
        AND e."showOnReport" = true
        AND EXTRACT(YEAR FROM e.date) = ${currentYear}
      GROUP BY EXTRACT(MONTH FROM e.date)
      ORDER BY month
    `;
    
    res.status(200).json(monthlySummary);
  } catch (error) {
    next(error);
  }
};

exports.getDailySummary = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { month, year } = req.query;
    
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();
    
    const dailySummary = await prisma.$queryRaw`
      SELECT 
        EXTRACT(DAY FROM e.date) as day,
        SUM(e.amount) as total
      FROM "Expense" e
      WHERE e."userId" = ${userId}
        AND e."deletedAt" IS NULL
        AND e."showOnReport" = true
        AND EXTRACT(MONTH FROM e.date) = ${currentMonth}
        AND EXTRACT(YEAR FROM e.date) = ${currentYear}
      GROUP BY EXTRACT(DAY FROM e.date)
      ORDER BY day
    `;
    
    res.status(200).json(dailySummary);
  } catch (error) {
    next(error);
  }
};