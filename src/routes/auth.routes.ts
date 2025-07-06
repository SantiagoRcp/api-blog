import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserValidators } from "../validators/user.validation";
import { ForgotPasswordValidation } from "../validators/forgotPassword.validation";
import { AuthValidation } from "../validators/auth.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

const userValid = new UserValidators();
const forgotPassword = new ForgotPasswordValidation();
const resetPassValid = new AuthValidation();
const user = new AuthController();

// @ts-ignore
router.post("/auth/register", userValid.registerValid(), validate, user.register.bind(user));
// @ts-ignore
router.post("/auth/login",userValid.loginValid(), validate, user.login.bind(user).bind(user));
// @ts-ignore
router.post("/auth/forgot-password", forgotPassword.forgotPassValid(), validate, user.forgotPassword.bind(user));
// @ts-ignore
router.post("/auth/reset-password",resetPassValid.resetPassValid(), validate,user.resetPassword.bind(user));

export default router;
