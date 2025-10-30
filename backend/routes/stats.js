const express = require("express");
const Category = require("../db/category");
const Product = require("../db/product");
const Brand = require("../db/brand");
const Order = require("../db/order");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [categories, products, brands, orders] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      Brand.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({
      categories,
      products,
      brands,
      orders,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});



module.exports = router;
