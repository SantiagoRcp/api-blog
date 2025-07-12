import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorization } from "../middlewares/authorize.middleware";
import { PostController } from "../controllers/post.controller";
import { PostValidation } from "../validators/post.validation";
import { validate } from "../middlewares/validate.middleware";


const router = Router();
const post = new PostController();
const postValid = new PostValidation();

// @ts-ignore
router.get("/post/", post.getPublicPosts.bind(post));
// @ts-ignore
router.get("/post/:idPost", post.getPostById.bind(post));
// @ts-ignore
router.post( "/post/", authMiddleware, authorization(["User", "Author", "Admin"]), postValid.post(), validate, post.newPost.bind(post));
// @ts-ignore
router.patch("/post/:idPost",authMiddleware,authorization(["Author", "Admin"]),postValid.update(), validate, post.updatePost.bind(post));
// @ts-ignore
router.delete("/post/:idPost",authMiddleware,authorization(["Author","Admin"]), post.deletePost.bind(post));

export default router;