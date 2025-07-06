import { body } from "express-validator";

export class ForgotPasswordValidation {
  forgotPassValid() {
    return [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email address"),
    ];
  }
}
