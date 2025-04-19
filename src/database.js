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
      const whereClause = {};
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      if (filters.search) {
        whereClause.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      
      const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: filters.sortBy ? { [filters.sortBy]: filters.sortOrder || 'desc' } : { id: 'desc' },
        skip: filters.skip,
        take: filters.take,
      });
      
      const totalCount = await prisma.product.count({ where: whereClause });
      
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
      // Calculate order total based on items
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
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return orders;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async (filters = {}) => {
    try {
      const whereClause = {};
      
      if (filters.status) {
        whereClause.status = filters.status;
      }
      
      if (filters.userId) {
        whereClause.userId = filters.userId;
      }
      
      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: filters.skip,
        take: filters.take,
      });
      
      const totalCount = await prisma.order.count({ where: whereClause });
      
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
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
        },
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
        data: { status },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: true,
        },
      });
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  },
};


module.exports = {
  ...dbOperations,
};