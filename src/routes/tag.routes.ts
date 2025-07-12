import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorization } from "../middlewares/authorize.middleware";
import { TagVAlidation } from "../validators/tag.validation";
import { validate } from "../middlewares/validate.middleware";
import { TagController } from "../controllers/tag.controller";

const router = Router();
const tagValid = new TagVAlidation();
const tag= new TagController();

// @ts-ignore
router.get("/tags", tag.getTags.bind(tag))
// @ts-ignore
router.post("/tag", authMiddleware, authorization(["Admin"]), tagValid.tag(), validate, tag.newTag.bind(tag));

export default router;