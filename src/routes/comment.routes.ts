import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CommentController } from "../controllers/comment.controller";
import { CommentValidation } from "../validators/comment.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router();
const commentValid = new CommentValidation();
const comment = new CommentController();

// @ts-ignore
router.get("/comments/:idPost", comment.getComments.bind(comment));
// @ts-ignore
router.post("/comments/:idPost", authMiddleware, commentValid.comment(), validate, comment.newComment.bind(comment));
// @ts-ignore
router.delete("/comments/:idComment", authMiddleware, comment.deletedComment.bind(comment));
// @ts-ignore
router.patch("/comments/:idComment", commentValid.comment(), validate, authMiddleware, comment.updateComment.bind(comment));

export default router;
