import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// import as module so we can handle default OR named export
import * as authRoutesModule from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Pratmandu API running" });
});

// support both export default and export { router }
const authRoutes = authRoutesModule.default || authRoutesModule.router;
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});