import { Router } from "express";
import { UserValidators } from "../validators/userValidators";
import { validate } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { authorization } from "../middlewares/authorize.middleware";

const router = Router();
const user = new UserController();
const userVali = new UserValidators();

// @ts-ignore  // Get user (perfil del usuario)
router.get("/user/me", authMiddleware, user.getProfile.bind(user));
// @ts-ignore  // Get all user (Todos los usuarios "admin")
router.get("/user/users", authMiddleware, authorization(["Admin"]), user.getAllUsers.bind(user));
// @ts-ignore  // Update user (actualizar datos basicos)
router.patch("/user/me", authMiddleware, userVali.updateUser(), validate, user.updateUser.bind(user));
// @ts-ignore  // Delete user (Eliminar cuenta)
router.delete("/user/me", authMiddleware, user.deleteUser.bind(user));

export default router;
