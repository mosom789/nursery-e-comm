const express = require("express");
const router = express.Router();
const User = require("./../db/user");

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send({ users });
});

// Update user (role, isAdmin etc.)
router.put("/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updatedUser);
});

// Delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({ success: true });
});

module.exports = router;
