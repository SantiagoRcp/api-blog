import { body } from "express-validator";

export class TagVAlidation {
  tag() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("The name must be a text")
        .isLength({ min: 3 })
        .withMessage("The name must have at least 3 characters"),

      body("slug")
        .trim()
        .notEmpty()
        .withMessage("Slug is required")
        .isSlug()
        .withMessage(
          "The slug must be in a valid format (no spaces, only lowercase and hyphens)"
        ),
    ];
  }
}
