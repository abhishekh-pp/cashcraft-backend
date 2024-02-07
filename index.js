const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();

const app = express();
const port = 3000;
const baseUrl = process.env.BASE_URL;

app.use(
  cors({
    origin: [baseUrl],
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);

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
