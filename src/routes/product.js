const express = require("express");
const router = express.Router();
const db = require("../database");
const {
  validateProductInput,
  validateProductQueryParams,
  validateResourceId
} = require("../middleware");
const { isAdmin } = require("../auth");

// POST /api/product
// Create product
router.post("/", isAdmin, async (req, res, next) => {
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

    const newProduct = await db.createProduct(
      {
        name: product.name,
        brand: product.brand,
        description: product.description,
        price: product.price,
        category: product.category,
        imageURL: product.imageURL,
        stock: product.stock,
        status: product.status
      }
    );

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// GET /api/product
// Get all products with optional filtering
router.get("/", validateProductQueryParams, async (req, res, next) => {
  try {
    const { search, status, sortBy, sortOrder, skip=0, take=10 } = req.query;

    const filters = {
      search,
      status,
      sortBy,
      sortOrder,
      skip,
      take,
    };

    const { products, totalCount } = await db.getAllProducts(filters);
    
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
    const product = await db.getProductById(id);

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
router.put("/:id", validateResourceId, isAdmin, async (req, res, next) => {
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

    const existingProduct = await db.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await db.updateProduct(id, productUpdate);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/product/:id
// Delete product
router.delete("/:id", validateResourceId, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingProduct = await db.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const hasOrderItems = await db.hasOrderItems(id);

    if (hasOrderItems) {
      return res.status(400).json({
        error: "Cannot delete product that is referenced in orders. Consider marking it as DISCONTINUED instead."
      });
    }

    await db.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;