import express, { json, urlencoded } from "express";
import userRoute from "./routes/user.route.js";
import { config } from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/connectDb.js";

config({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 8080;
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";

connectDb();

//Middlewares authentication authorization
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  }),
);

app.use("/api/v1/user", userRoute);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
