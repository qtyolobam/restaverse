import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// Environment variable
const PORT = process.env.PORT || 3000;

// Local imports
import restaurantRouter from "./routers/restaurant.router";
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router";

// Initializing the express appl
const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/users", userRouter);

// Running the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
