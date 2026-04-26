import express from "express";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import apiRoutes from "./src/routes/index.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;