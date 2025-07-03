import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((error: ValidationError) => ({
      field: error.type === "field" ? error.path : "body",
      issue: error.msg,
    }));

    return res.status(400).json({
      error: {
        status: 400,
        message: "Error de validación",
        details: errors,
      },
    });
  }

  next();
}
