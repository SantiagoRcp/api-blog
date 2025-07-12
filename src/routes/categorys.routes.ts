import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorization } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CategoryValidation } from "../validators/category.validations";
import { CategoryController } from "../controllers/category.controller";

const router = Router();
const catValid = new CategoryValidation();
const category = new CategoryController();

// @ts-ignore
router.get("/category/:idCategory", category.getCategory.bind(category));
// @ts-ignore
router.get("/categories", category.getAllCategories.bind(category));
// @ts-ignore
router.post("/category",authMiddleware,authorization(["Admin"]),catValid.category(),validate,category.newCategory.bind(category));

export default router;
