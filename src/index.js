import express, { json, urlencoded } from "express";
import userRoute from "./routes/user.route.js";
import { config } from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/connectDb.js";
import hackathonRoute from "./routes/hackathon.route.js";

config();
const app = express();
const PORT = process.env.PORT || 8080;
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";

connectDb();

//Middlewares authentication authorization
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/hackathon", hackathonRoute);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

