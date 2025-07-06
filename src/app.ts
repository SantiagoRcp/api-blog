import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRotes from "./routes/post.routes";
// import User from "./models/user.model";
// import PasswordResetCode from "./models/PasswordResetCodes.model";
// import Post from "./models/Post.model";

dotenv.config();
const app = express();

// PasswordResetCode.sync({ force: true })
//   .then(() => console.log("PasswordResetCode model synced successfully"))
//   .catch((error) =>
//     console.error("Error syncing PasswordResetCode model:", error)
//   );

// Post.sync({ force: true })
//   .then(() => console.log("Post synced successfully"))
//   .catch((error) => console.log("Error syncing Post Model", error));

// // Initialize Sequelize and sync models
// User.sync({ force: true })
//   .then(() => console.log("User model synced successfully"))
//   .catch((error) => console.error("Error syncing User model:", error));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRotes);

export default app;
