const express = require("express");
const mongoose = require("mongoose");
// const User = require("./models/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// var jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const baseUrl = process.env.BASE_URL;

app.use(
  cors({
    origin: [baseUrl],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);

// app.post("/user/signup", async (req, res, next) => {
//   try {
//     const hash = bcrypt.hashSync(req.body.password, saltRounds);
//     const user = new User({
//       ...req.body,
//       password: hash,
//     });
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).send("Invalid signup");
//   }
// });

// app.post("/user/login", async (req, res, next) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;

//     const user = await User.findOne({ email: email });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     const passwordMatch = bcrypt.compareSync(password, user.password);
//     if (!passwordMatch) {
//       return res.send(401).send("Login failed");
//     }
//     const token = jwt.sign(
//       { _id: user._id, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: 3 * 24 * 60 * 60 }
//     );

//     res.cookie("token", token, {
//       withCredentials: true,
//       httpOnly: false,
//     });

//     res.status(200).json({
//       message: "login successfull ",
//       user: { _id: user._id, name: user.name },
//     });
//   } catch (err) {
//     res.status(400).send("Invalid login");
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

main()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

async function main() {
  const url = process.env.DB_URL;
  const password = process.env.DB_PASSWORD;
  const urlWithPassword = url.replace("<password>", password);
  await mongoose.connect(urlWithPassword);
}
