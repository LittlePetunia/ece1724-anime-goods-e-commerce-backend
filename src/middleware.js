// Request logger middleware
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

// Validate product input
const validateProductInput = (product) => {
    const errors = [];

    if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
        errors.push("Product name is required");
    }

    if (!product.brand || typeof product.brand !== 'string' || product.brand.trim() === '') {
        errors.push("Brand is required");
    }

    if (!product.description || typeof product.description !== 'string' || product.description.trim() === '') {
        errors.push("Description is required");
    }

    if (product.price === undefined || product.price === null) {
        errors.push("Price is required");
    } else if (typeof product.price !== 'number' || product.price <= 0) {
        errors.push("Price must be a positive number");
    }

    if (product.stock === undefined || product.stock === null) {
        errors.push("Stock quantity is required");
    } else if (typeof product.stock !== 'number' || !Number.isInteger(product.stock) || product.stock < 0) {
        errors.push("Stock quantity must be a non-negative integer");
    }

    if (product.status === undefined || product.status === null) {
        errors.push("Product status is required");
    } else if (!['ACTIVE', 'INACTIVE', 'DISCONTINUED'].includes(product.status)) {
        errors.push("Status must be ACTIVE, INACTIVE, or DISCONTINUED");
    }

    if (!product.imageURL || typeof product.imageURL !== 'string' || product.imageURL.trim() === '') {
        errors.push("Image URL is required");
    }

    return errors;
};

// Validate user input
const validateUserInput = (user) => {
    const errors = [];

    if (!user.firstName || typeof user.firstName !== 'string' || user.firstName.trim() === '') {
        errors.push("First name is required");
    }

    if (!user.lastName || typeof user.lastName !== 'string' || user.lastName.trim() === '') {
        errors.push("Last name is required");
    }

    if (!user.email || typeof user.email !== 'string' || user.email.trim() === '') {
        errors.push("Email is required");
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(user.email)) {
        errors.push("Email format is invalid");
    }

    if (!user.address || typeof user.address !== 'string' || user.address.trim() === '') {
        errors.push("Address is required");
    }

    if (user.isAdmin !== undefined && typeof user.isAdmin !== 'boolean') {
        errors.push("isAdmin must be a boolean value");
    }

    return errors;
};

// Validate order input
const validateOrderInput = (order) => {
    const errors = [];

    if (!order.userId || typeof order.userId !== 'number' || !Number.isInteger(order.userId) || order.userId <= 0) {
        errors.push("Valid user ID is required");
    }

    if (order.status && !['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
        errors.push("Status must be PENDING, PROCESSING, SHIPPED, DELIVERED, or CANCELLED");
    }


    if (!Array.isArray(order.items) || order.items.length === 0) {
        errors.push("At least one order item is required");
    } else {
        order.items.forEach((item, index) => {
        if (!item.productId || typeof item.productId !== 'number' || !Number.isInteger(item.productId) || item.productId <= 0) {
            errors.push(`Order item ${index + 1}: Valid product ID is required`);
        }

        if (!item.quantity || typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity <= 0) {
            errors.push(`Order item ${index + 1}: Valid quantity is required`);
        }

        if (!item.unitPrice || typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
            errors.push(`Order item ${index + 1}: Valid unit price is required`);
        }
        });
    }

    return errors;
};

// Validate product query parameters
const validateProductQueryParams = (req, res, next) => {
    const { status, search, sortBy, sortOrder, skip, take } = req.query;
    const errors = [];


    if (status !== undefined && !['ACTIVE', 'INACTIVE', 'DISCONTINUED'].includes(status)) {
        errors.push("Status must be ACTIVE, INACTIVE, or DISCONTINUED");
    }


    if (sortBy !== undefined) {
        const validSortFields = ['name', 'price', 'stock', 'brand', 'id', 'createdAt'];
        if (!validSortFields.includes(sortBy)) {
        errors.push(`sortBy must be one of: ${validSortFields.join(', ')}`);
        }
    }

    if (sortOrder !== undefined && !['asc', 'desc'].includes(sortOrder)) {
        errors.push("sortOrder must be asc or desc");
    }

    if (skip !== undefined) {
        const parsedSkip = Number(skip);
        if (isNaN(parsedSkip) || !Number.isInteger(parsedSkip) || parsedSkip < 0) {
        errors.push("skip must be a non-negative integer");
        } else {
        req.query.skip = parsedSkip;
        }
    }


    if (take !== undefined) {
        const parsedTake = Number(take);
        if (isNaN(parsedTake) || !Number.isInteger(parsedTake) || parsedTake <= 0 || parsedTake > 100) {
        errors.push("take must be a positive integer not greater than 100");
        } else {
        req.query.take = parsedTake;
        }
    } else {
        req.query.take = 10; 
    }

    if (errors.length > 0) {
        return res.status(400).json({
        error: "Validation Error",
        message: "Invalid query parameter format",
        details: errors
        });
    }
    next();
};


const validateOrderQueryParams = (req, res, next) => {
    const { status, userId, skip, take } = req.query;
    const errors = [];


    if (status !== undefined && !['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
        errors.push("Status must be PENDING, PROCESSING, SHIPPED, DELIVERED, or CANCELLED");
    }


    if (userId !== undefined) {
        const parsedUserId = Number(userId);
        if (isNaN(parsedUserId) || !Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        errors.push("userId must be a positive integer");
        } else {
        req.query.userId = parsedUserId;
        }
    }


    if (skip !== undefined) {
        const parsedSkip = Number(skip);
        if (isNaN(parsedSkip) || !Number.isInteger(parsedSkip) || parsedSkip < 0) {
        errors.push("skip must be a non-negative integer");
        } else {
        req.query.skip = parsedSkip;
        }
    }

    if (take !== undefined) {
        const parsedTake = Number(take);
        if (isNaN(parsedTake) || !Number.isInteger(parsedTake) || parsedTake <= 0 || parsedTake > 100) {
        errors.push("take must be a positive integer not greater than 100");
        } else {
        req.query.take = parsedTake;
        }
    } else {
        req.query.take = 10; 
    }

    if (errors.length > 0) {
        return res.status(400).json({
        error: "Validation Error",
        message: "Invalid query parameter format",
        details: errors
        });
    }
    next();
};

// Validate resource ID parameter (used for products, orders, users)
const validateResourceId = (req, res, next) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
        error: "Validation Error",
        message: "Invalid ID format"
        });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
        return res.status(400).json({
        error: "Validation Error",
        message: "Invalid ID format"
        });
    }

    req.params.id = parsedId;
    next();
};

  // Error handler middleware
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
    });
};

module.exports = {
    requestLogger,
    validateProductInput,
    validateUserInput,
    validateOrderInput,
    validateProductQueryParams,
    validateOrderQueryParams,
    validateResourceId,
    errorHandler
};