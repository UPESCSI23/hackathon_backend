import express, { json, urlencoded } from "express";
import userRoute from "./routes/user.route.js";
import { config } from "dotenv";
import cors from "cors";
import { connectDb } from "./utils/connectDb.js";
import hackathonRoute from "./routes/hackathon.route.js";
import cookieParser from "cookie-parser";

config();
const app = express();
const PORT = process.env.PORT || 8080;
let CORS_ORIGIN = process.env.CORS_ORIGIN;

CORS_ORIGIN = CORS_ORIGIN.split(", ");

connectDb();

//Middlewares authentication authorization
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/hackathon", hackathonRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
