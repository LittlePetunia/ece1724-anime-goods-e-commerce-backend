const express = require("express");
const router = express.Router();
const db = require("../database");
const { validateUserInput } = require("../middleware");
const { isAdmin: requireAdminAuth, isSpecificUserOrAdmin, signJWT } = require("../auth");

// POST /api/user
// Create user
router.post("/", async (req, res, next) => {
  const errors = validateUserInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      details: errors
    });
  }
  try {
      const { firstName, lastName, password, email, address, isAdmin } = req.body;
      const operation = async () => {
        const checkDup = await db.getUserByEmail(email);
        if (checkDup) {
          return res.status(401).json({
            error: "Email already registered"
          });
        }
        const user = await db.createUser({ firstName, lastName, password, email, address, isAdmin });
        const { password: _, ...safeUser } = user;
        res.status(201).json(safeUser);
      };
      if (isAdmin) {
        // only current admin can create new admin!
        requireAdminAuth(req, res, operation);
      } else {
        operation();
      }
  } catch (error) {
    next(error);
  }
});

// GET /api/user/allCustomers
// Get all customers
router.get(
  "/allCustomers", requireAdminAuth,
  async (req, res, next) => {
    try {
      const all_customers = await db.getAllCustomers();
      console.log(all_customers)
      const safe_customers = all_customers.map(({ password, ...customer }) => customer);
      res.status(200).json(safe_customers);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/user/all
// Get all users (Admin)
router.get("/all", requireAdminAuth, async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    const safeUsers = users.map(({ password, ...user }) => user);
    res.status(200).json(safeUsers);
  } catch (error) {
    next(error);
  }
});

// GET /api/user/:email
// Find user by email
router.get("/:email", async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    } else {
      const authMiddleware = isSpecificUserOrAdmin(() => user.id);
      return authMiddleware(req, res, () => {
        // success
        const { password, ...safeUser } = user;
        res.status(200).json(safeUser);
      })
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/user/login
// Login with email and password
router.post("/login", async (req, res, next) => {
  try {
      const { email, password } = req.body;
      const user = await db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (user.password === password) {
        const { password, ...safeUser } = user;
        const token = signJWT(safeUser);
        res.status(200).json({
          user: safeUser,
          token: token,
        });
      } else {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }
  } catch (error) {
    next(error);
  }
});

// PUT /api/user/:id
// Update user
router.put("/:id", isSpecificUserOrAdmin((req) => parseInt(req.params.id)), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    const numId = parseFloat(id);
    if (isNaN(numId) || !Number.isInteger(numId)) {
      return res.status(400).json({ error: "Invalid User ID"});
    }
    const existingUser = await db.getUserById(numId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const errors = validateUserInput(userData);
    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation Error",
        details: errors
      });
    }

    // Only admins can change isAdmin status, if the user is not admin, ignore this change
    if (userData.isAdmin === true && !req.user.isAdmin) {
      userData.isAdmin = false;
    }

    const updatedUser = await db.updateUser(parseInt(id), userData);
    const { password, ...safeUpdatedUser } = updatedUser;
    res.status(200).json(safeUpdatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/user/:id
// Delete user
router.delete("/:id", isSpecificUserOrAdmin((req) => parseInt(req.params.id)), async (req, res, next) => {
  try {
    const { id } = req.params;
    const numId = parseFloat(id);
    if (isNaN(numId) || !Number.isInteger(numId)) {
      return res.status(400).json({ error: "Invalid User ID"});
    }

    const existingUser = await db.getUserById(numId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.deleteUser(numId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
