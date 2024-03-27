import express from "express";
import users from "./routes/users.mjs";
import { loggingMiddleware, cookieMiddleware } from "./utils/middleware.mjs";
import mockUsers from "./utils/database.mjs";
import products from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

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
app.use(users);
app.use(cookieMiddleware);
app.use(express.json());
app.use(loggingMiddleware);

app.use(products);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (req, res) => {
  console.log(req);
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.status(201).send({ msg: "Hello World" });
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return res
      .status(401)
      .send({ msg: "User Not Found Check Your Login Info" });

  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "User Not Found Check Your Login Info" });
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
