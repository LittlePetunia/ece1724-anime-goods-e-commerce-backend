const express = require("express");
const router = express.Router();
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");   
const orderRoutes = require("./routes/order");          

router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);

module.exports = router;
