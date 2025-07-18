import { Request, Response } from "express";
import { AutenticationRequest } from "../middlewares/auth.middleware";
import { CommentServices } from "../services/comment.service";
import { PostServices } from "../services/post.service";

const commentServ = new CommentServices();
const postServ = new PostServices();

export class CommentController {
  async newComment(req: AutenticationRequest, res: Response) {
    try {
      const idUser = req.user?.id;
      const idPost = parseInt(req.params.idPost);
      const { content } = req.body;

      if (typeof idUser !== "number") {
        return res.status(400).json({ ok: false, message: "Invalid User id" });
      }

      if (isNaN(idPost)) {
        return res.status(400).json({ ok: false, message: "Invalid Post id" });
      }

      const post = await postServ.getPostById(idPost);
      if (!post) {
        return res.status(404).json({ ok: false, message: "Post no found" });
      }

      const comment = await commentServ.newComment(idUser, idPost, content);
      const fullComment = await commentServ.getCommentById(comment.id);

      return res.status(201).json({
        ok: true,
        message: "comment created successfully",
        fullComment,
      });
    } catch (error) {
      console.log("Error in CommentController //newComment", error);

      return res
        .status(500)
        .json({ ok: false, message: "error creating comment" });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const idPost = parseInt(req.params.idPost);
      if (isNaN(idPost)) {
        return res.status(400).json({ ok: false, message: "Invalid Post id" });
      }

      const post = await postServ.getPostById(idPost);
      if (!post) {
        return res.status(404).json({ ok: false, message: "Post no found" });
      }

      const getComments = await commentServ.getAllCommentPost(idPost);
      if (!getComments) {
        return res
          .status(404)
          .json({ ok: false, message: "There are no comments yet" });
      }

      return res.status(200).json({ ok: true, getComments });
    } catch (error) {
      console.log("Error in commentController /getComments/", error);
      return res
        .status(500)
        .json({ ok: false, messge: "error getting comments" });
    }
  }

  async deletedComment(req: AutenticationRequest, res: Response) {
    try {
      const idUser = req.user?.id;
      const role = req.user?.role;
      const idComment = parseInt(req.params.idComment);
      if (isNaN(idComment)) {
        return res.status(400).json({ ok: false, message: "Invalid Post id" });
      }

      const commetn = await commentServ.getComment(idComment);
      if (!commetn) {
        return res.status(400).json({ ok: false, message: "comment no found" });
      }

      if (commetn.author_id === idUser || role === "Admin") {
        await commetn.destroy();
        return res
          .status(200)
          .json({ ok: true, message: "Comment successfully deleted" });
      } else {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to delete this comment",
        });
      }
    } catch (error) {
      console.log("Error In Commentcontroller /deletedComment/", error);
      return res
        .status(500)
        .json({ ok: false, message: "error deleting comment" });
    }
  }

  async updateComment(req: AutenticationRequest, res: Response) {
    try {
      const iduser = req.user?.id;
      const content = req.body.content;
      const idComment = parseInt(req.params.idComment);
      if (isNaN(idComment)) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid comment id" });
      }

      const comment = await commentServ.getComment(idComment);
      if (!comment)
        return res.status(404).json({ ok: false, message: "Comment no found" });

      const isAuthorcommetn = iduser === comment.author_id;
      if (!isAuthorcommetn) {
        return res.status(403).json({
          ok: false,
          message: "You do not have permission to delete this comment",
        });
      }

      await comment.update({ content });
      await comment.save();

      return res.status(200).json({
        ok: true,
        message: "Comment updated successfully",
        comment: {
          id: comment.id,
          content: comment.content,
          updatedAt: comment.updatedAt,
        },
      });
    } catch (error) {
      console.log("Error in CommentControlle /updateComment/", error);
      return res
        .status(500)
        .json({ ok: false, message: "error updating comment" });
    }
  }
}
