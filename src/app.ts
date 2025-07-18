import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRotes from "./routes/post.routes";
import categoryRoutes from "./routes/categorys.routes";
import tagRouter from "./routes/tag.routes"
import commentRouter from "./routes/comment.routes"
import "./models/associations";
import sequelize from "./config/db";

dotenv.config();
const app = express();

// sequelize.sync({ force: true });


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRotes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", tagRouter);
app.use("/api/v1", commentRouter);

export default app;
