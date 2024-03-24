import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  res.send([
    {
      id: 123,
      name: "laptop",
      price: 1000,
    },
  ]);
});

export default router;
