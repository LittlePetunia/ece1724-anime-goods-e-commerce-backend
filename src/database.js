const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dbOperations = {
  // User Operations
  createUser: async (userData) => {
    try {
      const user = await prisma.user.create({
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
          email: userData.email,
          address: userData.address,
          isAdmin: userData.isAdmin,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  getAllCustomers: async () => {
    try {
      const customers = await prisma.user.findMany({ where: {isAdmin: false} } );
      return customers;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    try {
      const user = await prisma.user.findUnique({where: { email }});
      return user || null;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await prisma.user.delete({
        where: { id },
      });

      return;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a user by their ID
   * @param {number} id - The user ID
   * @returns {Promise<Object|null>} The user object or null if not found
   */
  getUserById: async (id) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Product Operations
  createProduct: async (productData) => {
    try {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          imageURL: productData.imageURL,
          category: productData.category,
          stock: productData.stock,
          status: productData.status || 'ACTIVE',
          brand: productData.brand,
        },
      });
      return product;
    } catch (error) {
      throw error;
    }
  },

  getAllProducts: async (filters = {}) => {
    try {
      const { search, status, sortBy, sortOrder, skip = 0, take = 10 } = filters;

      const where = {};

      if (status) {
        where.status = filters.status;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const orderBy = {};
      if (sortBy) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      } else {
        orderBy.id = 'asc';
      }

      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip: filters.skip,
        take: filters.take,
      });

      const totalCount = await prisma.product.count({ where: where });

      return { products, totalCount };
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });
      return product || null;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: productData,
      });
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return;
    } catch (error) {
      throw error;
    }
  },

  // Order Operations
  createOrder: async (orderData) => {
    try {
      let totalAmount = 0;
      for (const item of orderData.items) {
        totalAmount += item.unitPrice * item.quantity;
      }

      const order = await prisma.order.create({
        data: {
          userId: orderData.userId,
          status: orderData.status || 'PENDING',
          orderItems: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: true,
        },
      });
      return order;
    } catch (error) {
      throw error;
    }
  },

  getOrdersByUserId: async (userId) => {
    try {
      const where = { userId };
      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where,
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
                    name: true,
                    imageURL: true
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
      return orders;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async ({ where = {}, skip = 0, take = 10 } = {}) => {
    try {
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
      return { orders, totalCount };
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
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
      return order || null;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status }
      });
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  },

  hasOrderItems: async (productId) => {
    try {
      const count = await prisma.orderItem.count({
        where: { productId }
      });

      return count > 0;
    } catch (error) {
      throw error;
    }
  }

};


module.exports = {
  ...dbOperations,
};