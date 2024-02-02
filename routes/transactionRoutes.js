const express = require("express");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

router.post("/", authenticateJWT, async (req, res) => {
  try {
    // Check if the user has the necessary permissions
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { amount, type, category, description } = req.body;

    const transaction = new Transaction({
      userId: req.user._id,
      amount,
      type,
      category,
      description,
    });
    await transaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.delete("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const deletedTransaction = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({
      message: "Transaction deleted successfully",
      transaction: deletedTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
