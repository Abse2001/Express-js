import mockUsers from "./database.mjs";
export const duplicateUserMiddleware = (request, response, next) => {
  const { username } = request.body;
  const userFound = mockUsers.find((user) => user.username === username);
  if (userFound) {
    return response.status(409).send({ Message: "Username already exisits" });
  }
  next();
};

export const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

export const cookieMiddleware = (req, res, next) => {
  const count = parseInt(req.cookies[req.url]);

  if (count > 0) res.cookie(req.url, count + 1);
  else res.cookie(req.url, 1);

  console.log(req.cookies);
  next();
};
