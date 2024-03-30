import express from "express";
import users from "./routes/users.mjs";
import { loggingMiddleware, cookieMiddleware } from "./utils/middleware.mjs";
import mockUsers from "./utils/database.mjs";
import products from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/local-stratrgy.mjs";
import "dotenv/config";
import mongoose from "mongoose";
import conntectDB from "./utils/dbConnect.mjs";
const app = express();
conntectDB();
app.use(cookieParser());
app.use(
  session({
    secret: "abse",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieMiddleware);
app.use(express.json());
app.use(loggingMiddleware);

app.use(users);
app.use(products);

const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
  });
});

app.get("/", (req, res) => {
  req.session.visited = true;
  res.status(201).send({ msg: "Hello World" });
});

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
  console.log(`Inside /auth/status endpoint`);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post("/api/logout", (req, res) => {
  if (!req.user) return response.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { item } = req.body;
  const { cart } = req.session;
  const cart2 = req.session.cart;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  req.session.cart.push("hi");
  return res.status(201).send(req.session.cart);
});
