// Auth middlewares and helper functions

const jwt = require('jsonwebtoken');

// Fallback secret for development only
const FALLBACK_SECRET = 'jwt_secret_419';

// Get JWT secret with fallback
const getJWTSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.warn('WARNING: JWT_SECRET not found in environment variables. Using fallback secret.');
        return FALLBACK_SECRET;
    }
    return secret;
};


/**
 * @param {string} token
 * @returns {{id: number, isAdmin: boolean}}
 */
const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, getJWTSecret());

        // Validate the decoded token has required properties
        if (!decoded.id || typeof decoded.isAdmin !== 'boolean') {
            throw new Error('Invalid token payload');
        }

        return decoded;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token has expired');
        }
        throw error;
    }
};

/**
 * Signs a JWT token with minimal user data
 * @param {User} user - The user object to sign
 * @param {string} [expiresIn='24h'] - Token expiration time
 * @returns {string} The signed JWT token
 * @throws {Error} If user object is invalid or missing required properties
 */
const signJWT = (user, expiresIn = '24h') => {
    // Validate user object has required properties
    if (!user || typeof user !== 'object') {
        throw new Error('Invalid user object');
    }

    if (typeof user.id !== 'number' || typeof user.isAdmin !== 'boolean') {
        throw new Error('User must have id (number) and isAdmin (boolean) properties');
    }

    // Create minimal token payload with only essential data
    const payload = {
        id: user.id,
        isAdmin: user.isAdmin
    };

    return jwt.sign(payload, getJWTSecret(), { expiresIn });
};

// Verify JWT token and attach user to request
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        req.user = decodeToken(token);
        next();
    } catch (error) {
        if (error.message === 'Token has expired') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Level 1: User authentication - any valid user can access
const isUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        next();
    });
};

// /**
//  * Level 2: Specific user - only the owner can access
//  * @param {(req: any) => number} getUserId - Callback function to extract userId from req
//  * @returns {Function} Middleware function
//  */
// const isSpecificUser = (getUserId) => {
//     return (req, res, next) => {
//         verifyToken(req, res, () => {
//             if (!req.user) {
//                 return res.status(401).json({ error: 'Authentication required' });
//             }

//             const requestedUserId = getUserId(req);
//             if (requestedUserId === undefined || requestedUserId === null) {
//                 return res.status(400).json({ error: 'User ID not found in request' });
//             }

//             if (req.user.id !== requestedUserId) {
//                 return res.status(403).json({ error: 'Access denied: Not the resource owner' });
//             }
//             next();
//         });
//     };
// };

/**
 * Level 3: Specific user or admin - owner or admin can access
 * @param {(req: any) => number|Promise<number>} getUserId - Callback function to extract userId from req
 * @returns {(req: any, res: any, next: any) => void} Middleware function
 */
const isSpecificUserOrAdmin = (getUserId) => {
    return (req, res, next) => {
        verifyToken(req, res, async () => {
            if (!req.user) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            try {
                const requestedUserId = await Promise.resolve(getUserId(req));
                if (requestedUserId === undefined || requestedUserId === null) {
                    return res.status(400).json({ error: 'User ID not found in request' });
                }
                console.log(`requestedUserId = ${requestedUserId}, token UserID = ${req.user.id}`);
                if (req.user.id !== requestedUserId && !req.user.isAdmin) {
                    return res.status(403).json({ error: 'Access denied: Not the resource owner or admin' });
                }
                next();
            } catch (error) {
                console.error('Error in isSpecificUserOrAdmin middleware:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    };
};

// Level 4: Admin only - only admin can access
const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied: Admin privileges required' });
        }
        next();
    });
};

module.exports = {
    verifyToken,
    isUser,
    // isSpecificUser,
    isSpecificUserOrAdmin,
    isAdmin,
    signJWT
};

