import { Router } from "express";
import { signin, signup } from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.post("/signin", signin);
userRoute.post("/signup", signup);

// Protected route

// userRoute.post("/dashboard", dashboard);

export default userRoute;
