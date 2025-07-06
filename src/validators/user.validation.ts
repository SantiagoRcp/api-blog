import { body } from "express-validator";

export class UserValidators {
  registerValid() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("nName must be between 3 and 50 characters long"),

      body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters long"),

      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email address"),

      body("password")
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

      body("role").optional().isIn(["User", "Author", "Admin"]),

      body("interests")
        .optional()
        .isArray()
        .withMessage("Interests must be an array"),

      body("profileimage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
    ];
  }

  updateUser() {
    return [
      body("name")
        .optional()
        .trim()
        .isString()
        .withMessage("The name must be a text string.")
        .isLength({ min: 3, max: 50 }),

      body("username")
        .optional()
        .trim()
        .isAlphanumeric()
        .withMessage("Username must contain only letters and numbers")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters long"),

      body("interests")
        .optional()
        .isArray()
        .withMessage("Interests must be an array"),

      body("profileimage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
    ];
  }

  loginValid() {
    return [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be a valid email address"),

      body("password").trim().notEmpty().withMessage("Password is required"),
    ];
  }
}
