import express from "express";
import { loggingMiddleware, cookieMiddleware } from "./utils/middleware.mjs";
import mockUsers from "./routes/users.mjs";
import products from "./routes/products.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(cookieMiddleware);
app.use(express.json());
app.use(loggingMiddleware);
app.use(mockUsers);
app.use(products);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello World" });
});
