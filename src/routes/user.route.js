import { Router } from "express";
import {
  refreshToken,
  signin,
  signup,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRoute = Router();

userRoute.post("/signin", signin);
userRoute.post("/signup", signup);
userRoute.post("/refresh", refreshToken);

// Protected route

userRoute.get("/", verifyJWT, (req, res) => {
  console.log("works", req.user);
  res.json({ user: req.user });
});

export default userRoute;
