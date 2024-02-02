const express = require("express");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction");
const User = require("../models/user"); // Assuming you have a User model
const router = express.Router();

const verifyLogin = (req, res, next) => {
  const token = req.cookies.token;

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded._id;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized access");
  }
};

// Get all transactions
router.get("/transactions", verifyLogin, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new transaction
router.post("/transactions", verifyLogin, async (req, res) => {
  const user = req.user;
  const { amount, type, category, description } = req.body;

  try {
    if (
      !amount ||
      isNaN(amount) ||
      !type ||
      !["income", "expense", "investment"].includes(type) ||
      !category
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const newTransaction = new Transaction({
      userId: user,
      amount,
      type,
      category,
      description,
    });

    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:transactionId", verifyLogin, async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;

    // Validate input data
    if (
      !amount ||
      isNaN(amount) ||
      !type ||
      !["income", "expense", "investment"].includes(type) ||
      !category
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      {
        amount,
        type,
        category,
        description,
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Route to delete a transaction
router.delete("/:transactionId", verifyLogin, async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.transactionId
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
