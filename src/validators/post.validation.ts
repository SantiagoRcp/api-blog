import { body } from "express-validator";

export class PostValidation {
  post() {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("The title must be a text")
        .isLength({ min: 5 })
        .withMessage("The title must have at least 5 characters"),

      body("content")
        .trim()
        .notEmpty()
        .withMessage("Contet is required")
        .isString()
        .withMessage("The title must be a text")
        .isLength({ min: 50 })
        .withMessage("The title must have at least 50 characters"),

      body("status")
        .trim()
        .optional()
        .isIn(["draft", "published"])
        .withMessage("The status must be 'draft' or 'published'"),

      body("tag_ids")
        .trim()
        .optional()
        .isArray()
        .withMessage("tag_ids must be a non-empty array"),

      body("tag_ids.*")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Each tag_id must be a valid integer"),
    ];
  }

  update(){
    return [
      body("title")
        .trim()
        .optional()
        .isString()
        .withMessage("The title must be a text")
        .isLength({ min: 5 })
        .withMessage("The title must have at least 5 characters"),

      body("content")
        .trim()
        .optional()
        .isString()
        .withMessage("The title must be a text")
        .isLength({ min: 50 })
        .withMessage("The title must have at least 50 characters"),

      body("status")
        .trim()
        .optional()
        .isIn(["draft", "published"])
        .withMessage("The status must be 'draft' or 'published'"),
    ];
  }
}
