import { Router } from "express";
import { body, validationResult } from "express-validator";
import mockUsers from "../utils/database.mjs";
import { duplicateUserMiddleware } from "../utils/middleware.mjs";
const router = Router();
router.get("/api/users", (req, res) => {
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
router.post(
  "/api/users",
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string"),
  duplicateUserMiddleware,
  (req, res) => {
    const { body } = req;
    const queryErrors = validationResult(req).errors;
    console.log(queryErrors);
    if (queryErrors.length > 0) {
      let errorMessage = "";
      for (let i = 0; i < queryErrors.length; i++) {
        errorMessage += queryErrors[i].msg + " ";
      }
      return res.status(400).send(errorMessage);
    }
    const newUser = { id: uuid(), ...body };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);
router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const user = mockUsers.find((user) => user.id === id);
  if (!user) {
    res.status(404).send({ msg: "user not found" });
  }
  res.send(user);
});
router.put(
  "/api/users/:id",
  duplicateUserMiddleware,
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username most be a string"),
  (req, res) => {
    const {
      body,
      params: { id },
    } = req;
    const queryErrors = validationResult(req).errors;
    if (queryErrors.length > 0) {
      let errorMessage = "";
      for (let i = 0; i < queryErrors.length; i++) {
        errorMessage += queryErrors[i].msg + " ";
      }
      return res.status(400).send(errorMessage);
    }

    const findUserIndex = mockUsers.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = { id: id, ...body };
    return res.status(200).send(mockUsers[findUserIndex]);
  }
);
router.patch("/api/users/:id", duplicateUserMiddleware, (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const findUserIndex = mockUsers.findIndex((user) => user.id === id);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(200).send(mockUsers[findUserIndex]);
});
router.delete("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const findUserIndex = mockUsers.findIndex((user) => user.id === id);
  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});
router.delete("/api/users", (req, res) => {
  const { username } = req.body;

  const userIndex = mockUsers.findIndex((user) => username === user.username);

  if (userIndex === -1) return res.sendStatus(404);

  mockUsers.splice(userIndex, 1);
  return res.sendStatus(200);
});

export default router;
