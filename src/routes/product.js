const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { 
  validateProductInput, 
  validateProductQueryParams, 
  validateResourceId 
} = require("../middleware");

// POST /api/product
// Create product
router.post("/", async (req, res, next) => {
  try {
    const product = req.body;
    
    const errors = validateProductInput(product);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid product data",
        details: errors
      });
    }
    
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        imageURL: product.imageURL,
        stock: product.stock,
        status: product.status
      }
    });
    
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// GET /api/product
// Get all products with optional filtering
router.get("/", validateProductQueryParams, async (req, res, next) => {
  try {
    const { search, status, sortBy, sortOrder, skip, take } = req.query;

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }

    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.id = 'asc';
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: skip || 0,
        take: take || 10
      }),
      prisma.product.count({ where })
    ]);
    
    res.status(200).json({
      products,
      pagination: {
        total: totalCount,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(totalCount / take)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/product/:id
// Get product by ID
router.get("/:id", validateResourceId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/product/:id
// Update product
router.put("/:id", validateResourceId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const productUpdate = req.body;
    
    const errors = validateProductInput(productUpdate);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid product data",
        details: errors
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: productUpdate.name,
        brand: productUpdate.brand,
        description: productUpdate.description,
        price: productUpdate.price,
        imageURL: productUpdate.imageURL,
        stock: productUpdate.stock,
        status: productUpdate.status
      }
    });
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/product/:id
// Partial update product
router.patch("/:id", validateResourceId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const partialProduct = {...req.body};
    
    if (updates.status && !['ACTIVE', 'INACTIVE', 'DISCONTINUED'].includes(updates.status)) {
      return res.status(400).json({ 
        error: "Validation Error",
        message: "Invalid product status",
        details: ["Status must be ACTIVE, INACTIVE, or DISCONTINUED"]
      });
    }
    
    if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price <= 0)) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid price value",
        details: ["Price must be a positive number"]
      });
    }
    
    if (updates.stock !== undefined && (typeof updates.stock !== 'number' || !Number.isInteger(updates.stock) || updates.stock < 0)) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid stock value",
        details: ["Stock quantity must be a non-negative integer"]
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updates
    });
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/product/:id
// Delete product
router.delete("/:id", validateResourceId, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    const orderItemCount = await prisma.orderItem.count({
      where: { productId: id }
    });
    
    if (orderItemCount > 0) {
      return res.status(400).json({ 
        error: "Cannot delete product that is referenced in orders. Consider marking it as DISCONTINUED instead." 
      });
    }
    
    await prisma.product.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;