const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const verifyLogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Unauthorized access");
  }
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded._id;
  } catch (err) {
    res.status(401).send("Unauthorized access");
  }
  next();
};

router.post("/user/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = new User({
      name,
      email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid signup" });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Login failed" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: 3 * 24 * 60 * 60 }
    );
    console.log(user.name);
    res.cookie("token", token, { withCredentials: true, httpOnly: true });
    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid login" });
  }
});

router.post("/users/verify", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("User not logged in");
  }
  return res.status(200).send("User is logged in");
});

module.exports = router;
