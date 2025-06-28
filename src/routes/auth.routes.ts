import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserValidators } from "../validators/userValidators";
import { ForgotPasswordValidation } from "../validators/forgotPasswordValidation";
import { AuthValidation } from "../validators/auth.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

const userValid = new UserValidators();
const forgotPassword = new ForgotPasswordValidation();
const resetPassValid = new AuthValidation();
const user = new AuthController();

// @ts-ignore
router.post("/auth/register", userValid.registerValid(), validate, user.register);
// @ts-ignore
router.post("/auth/login", userValid.loginValid(), validate, user.login);
// @ts-ignore
router.post("/auth/forgot-password", forgotPassword.forgotPassValid(), validate, user.forgotPassword);
// @ts-ignore
router.post("/auth/reset-password", resetPassValid.resetPassValid(), validate, user.resetPassword);

export default router;
