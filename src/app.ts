import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
// import User from "./models/user.model";
// import PasswordResetCode from "./models/PasswordResetCodes.model";

dotenv.config();
const app = express();

// // Initialize Sequelize and sync models
// User.sync({ force: true })
//   .then(() => console.log("User model synced successfully"))
//   .catch((error) => console.error("Error syncing User model:", error));

// PasswordResetCode.sync({ force: true })
//   .then(() => console.log("PasswordResetCode model synced successfully"))
//   .catch((error) =>
//     console.error("Error syncing PasswordResetCode model:", error)
//   );

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

export default app;
