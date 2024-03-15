import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);

  const mockUsers = [
    {
      id: 1,
      name: "abse adel",
    },
    {
      id: 2,
      name: "anas",
    },
    {
      id: 3,
      name: "ahmed",
    },
  ];

  app.get("/", (req, res) => {
    res.status(201).send({ msg: "Hello World" });
  });

  app.get("/api/users", (req, res) => {
    console.log(req.query);
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

  app.post("/api/users", (req, res) => {
    console.log(req.body);
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
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
    const parseid = parseInt(req.params.id);
    console.log(parseid);
    if (isNaN(parseid)) {
      res.status(400).send({ msg: "Bad request, invalid id" });
    }
    const user = mockUsers.find((user) => user.id === parseid);
    if (!user) {
      res.status(404).send({ msg: "user not found" });
    }
    res.send(user);
  });

  app.put("/api/users/:id", (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    const parseid = parseInt(id);

    if (isNaN(parseid)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parseid);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = { id: parseid, ...body };
    return res.status(200).send(mockUsers[findUserIndex]);
  });

  app.patch("/api/users/:id", (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    const parseid = parseInt(id);

    if (isNaN(parseid)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parseid);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.status(200).send(mockUsers[findUserIndex]);
  });
});
