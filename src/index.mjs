import express from "express";

import { v4 as uuid } from "uuid";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);

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
          console.log(user);
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

  app.post("/api/users", (req, res) => {
    const { username } = req.body;
    const userFound = mockUsers.find((user) => user.username === username);
    if (userFound)
      return res.status(409).send({ Message: "Username already exisits" });
    console.log(req.body);
    const { body } = req;
    const newUser = { id: uuid(), ...body };
    console.log(newUser);
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  });

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
    console.log(req.params);
    const { id } = req.params;
    console.log(parseid);

    const user = mockUsers.find((user) => user.id === id);
    if (!user) {
      res.status(404).send({ msg: "user not found" });
    }
    res.send(user);
  });

  app.put("/api/users/:id", (req, res) => {
    const { username } = req.body;
    const userFound = mockUsers.find((user) => user.username === username);
    if (userFound)
      return res.status(409).send({ Message: "Username already exisits" });
    const {
      body,
      params: { id },
    } = req;

    const findUserIndex = mockUsers.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = { id: id, ...body };
    return res.status(200).send(mockUsers[findUserIndex]);
  });

  app.patch("/api/users/:id", (req, res) => {
    const { username } = req.body;
    const userFound = mockUsers.find((user) => user.username === username);
    if (userFound)
      return res.status(409).send({ Message: "Username already exisits" });
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
