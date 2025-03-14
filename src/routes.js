const express = require("express");
const router = express.Router();
const userRoutes = require("./routes/users");

router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);

module.exports = router;
