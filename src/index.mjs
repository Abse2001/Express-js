import express, { request } from "express";
import { query, body, validationResult } from "express-validator";

import { v4 as uuid } from "uuid";

const app = express();
app.use(express.json());

const duplicateUserMiddleware = (request, response, next) => {
  const { username } = request.body;
  const userFound = mockUsers.find((user) => user.username === username);
  if (userFound) {
    return response.status(409).send({ Message: "Username already exisits" });
  }
  next();
};

const mockUsers = [
  {
    id: uuid(),
    username: "abse",
    name: "abse adel",
  },
  {
    id: uuid(),
    username: "anas",
    name: "anas",
  },
  {
    id: uuid(),
    username: "ahmed",
    name: "ahmed",
  },
];

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);

  app.get("/", (req, res) => {
    res.status(201).send({ msg: "Hello World" });
  });

  app.get("/api/users", (req, res) => {
    const { username } = req.body;
    const userFound = mockUsers.find((user) => user.username === username);

    if (!userFound && username)
      return res.status(404).send({ Message: "Username does not exists" });

    if (userFound && username) return res.send(userFound.id);

    const { filter, value } = req.query;

    if (filter && value)
      return res.send(
        mockUsers.filter((user) => {
          return user[filter].includes(value);
        })
      );

    return res.send(mockUsers);
  });

  app.delete("/api/users", (req, res) => {
    const { username } = req.body;

    const userIndex = mockUsers.findIndex((user) => username === user.username);

    if (userIndex === -1) return res.sendStatus(404);

    mockUsers.splice(userIndex, 1);
    return res.sendStatus(200);
  });

  app.post(
    "/api/users",
    body("username").notEmpty().withMessage("Username is required"),
    duplicateUserMiddleware,
    (req, res) => {
      const { body } = req;
      const queryErrors = validationResult(req).errors;
      if (queryErrors.length > 0)
        return res.status(400).send({ msg: queryErrors[0].msg });
      const newUser = { id: uuid(), ...body };
      mockUsers.push(newUser);
      return res.status(201).send(newUser);
    }
  );

  app.get("/api/products", (req, res) => {
    res.send([
      {
        id: 123,
        name: "laptop",
        price: 1000,
      },
    ]);
  });

  app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;

    const user = mockUsers.find((user) => user.id === id);
    if (!user) {
      res.status(404).send({ msg: "user not found" });
    }
    res.send(user);
  });

  app.put(
    "/api/users/:id",
    duplicateUserMiddleware,
    body("username").notEmpty().withMessage("Username is required"),
    (req, res) => {
      const {
        body,
        params: { id },
      } = req;
      const queryErrors = validationResult(req).errors;
      if (queryErrors.length > 0)
        return res.status(400).send({ msg: queryErrors[0].msg });
      if (body.username === undefined)
        return res.status(400).send({ msg: "Username is required" });

      const findUserIndex = mockUsers.findIndex((user) => user.id === id);
      if (findUserIndex === -1) return res.sendStatus(404);
      mockUsers[findUserIndex] = { id: id, ...body };
      return res.status(200).send(mockUsers[findUserIndex]);
    }
  );

  app.patch("/api/users/:id", duplicateUserMiddleware, (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    const findUserIndex = mockUsers.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.status(200).send(mockUsers[findUserIndex]);
  });

  app.delete("/api/users/:id", (req, res) => {
    const {
      body,
      params: { id },
    } = req;
    const findUserIndex = mockUsers.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return res.sendStatus(404);

    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
  });
});
