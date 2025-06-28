import { body } from "express-validator";

export class AuthValidation {
  resetPassValid() {
    return [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email address"),

      body("code")
        .trim()
        .notEmpty()
        .withMessage("Code is required")
        .isLength({ min: 8, max: 8 })
        .withMessage("The code must be exactly 6 characters long."),

      body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be between 8 and 20 characters long")
        .matches(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,50}$"
        )
        .withMessage(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
        ),
    ];
  }
}
