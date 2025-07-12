import { body } from "express-validator";

export class CategoryValidation {
  category() {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage("The name of the category is required"),

      body("slug")
        .trim()
        .isSlug()
        .withMessage(
          "The slug must be in a valid format (no spaces, only lowercase and hyphens)"
        ),
    ];
  }
}
