const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // Check if category with same name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        deletedAt: null
      }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = await prisma.category.create({
      data: {
        name
      }
    });
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    // Check if category exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if new name conflicts with existing category
    if (name !== existingCategory.name) {
      const nameConflict = await prisma.category.findFirst({
        where: {
          name,
          deletedAt: null,
          id: {
            not: parseInt(id)
          }
        }
      });
      
      if (nameConflict) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name }
    });
    
    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        deletedAt: null
      }
    });
    
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category is in use
    const expensesUsingCategory = await prisma.expense.count({
      where: {
        categoryId: parseInt(id),
        deletedAt: null
      }
    });
    
    if (expensesUsingCategory > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is in use. Please update or delete associated expenses first.',
        expenseCount: expensesUsingCategory
      });
    }
    
    // Soft delete
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }
    });
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};