import { Router } from "express";
import { getProblemStatements } from "../controllers/hackathon.controller.js";

const hackathonRoute = Router();

hackathonRoute.get("/problem-statement", getProblemStatements);

export default hackathonRoute;
