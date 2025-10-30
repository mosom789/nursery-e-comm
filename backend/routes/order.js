const express = require("express");
const router = express.Router();
const { getOrders, updateOrder, deleteOrder } = require("../handlers/order-handler");

// Fetch all orders
router.get("/", async (req, res) => {
  const orders = await getOrders();
  res.send({ orders });
});

// Update order status
router.put("/:id", async (req, res) => {
  const updatedOrder = await updateOrder(req.params.id, req.body);
  res.send(updatedOrder);
});

// Delete order
router.delete("/:id", async (req, res) => {
  await deleteOrder(req.params.id);
  res.send({ success: true });
});

module.exports = router;
