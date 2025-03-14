const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { 
  validateOrderInput, 
  validateOrderQueryParams, 
  validateResourceId 
} = require("./middleware");

// POST /api/order
// Create a new order
router.post("/", async (req, res, next) => {
  try {
    const order = req.body;
    
    const errors = validateOrderInput(order);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid order data",
        details: errors
      });
    }

    const orderItems = [];
    
    for (const item of order.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      
      if (!product) {
        return res.status(404).json({ 
          error: `Product with ID ${item.productId} not found` 
        });
      }
      
      if (product.status !== 'ACTIVE') {
        return res.status(400).json({ 
          error: `Product "${product.name}" is not available for purchase` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Not enough stock for "${product.name}". Available: ${product.stock}` 
        });
      }
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price
      });
      
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity }
      });
    }
    
    const newOrder = await prisma.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          userId: order.userId,
          status: order.status || 'PENDING',
          orderItems: {
            create: orderItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }))
          }
        },
        include: {
          orderItems: true
        }
      });
    });
    
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// GET /api/order/user/:userId
// Get orders by user ID
router.get("/user/:userId", validateResourceId, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                imageURL: true
              }
            }
          }
        }
      }
    });
    
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/order
// Get all orders with optional filtering (admin)
router.get("/", validateOrderQueryParams, async (req, res, next) => {
  try {
    const { status, userId, skip, take } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: skip || 0,
        take: take || 10,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          orderItems: {
            include: {
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count({ where })
    ]);
    
    res.status(200).json({
      orders,
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

// GET /api/order/:id
// Get order by ID
router.get("/:id", validateResourceId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            address: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/order/:id/status
// Update order status
router.patch("/:id/status", validateResourceId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true }
    });
    
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
      for (const item of existingOrder.orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        
        if (product) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: product.stock + item.quantity }
          });
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      }
    });
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

module.exports = router;