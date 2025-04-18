const express = require("express");
const router = express.Router();
const db = require("../database");
const { validateUserInput } = require("../middleware");

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
      const user = await db.createUser({ firstName, lastName, password, email, address, isAdmin });
      const { password: _, ...safeUser } = user;
      res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
});

// GET /api/user/allCustomers
// Get all customers
router.get(
  "/allCustomers",
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
      const { password, ...safeUser } = user;
      res.status(200).json(safeUser);
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
        return res.status(404).json({ error: "User not found" });
      }
      if (user.password === password) {
        const { password, ...safeUser } = user;
        res.status(200).json(safeUser);
      } else {
        return res.status(401).json({
          error: "Password not match"
        });
      }
  } catch (error) {
    next(error);
  }
});

// PUT /api/user/:id
// Update user
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await db.updateUser(parseInt(id), userData);
    const { password, ...safeUpdatedUser } = updatedUser;
    res.status(200).json(safeUpdatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/user/:id
// Delete user
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.deleteUser(parseInt(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
