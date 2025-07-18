import { body } from "express-validator";

export class CommentValidation {
  comment() {
    return [
      body("content")
        .trim()
        .notEmpty()
        .withMessage("comment content is missing")
        .isString()
        .withMessage("The comment must be text")
        .isLength({ min: 5 })
        .withMessage("The comment must be at least 5 characters long."),
    ];
  }
}
