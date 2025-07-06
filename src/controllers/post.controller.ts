import { Request, Response } from "express";
import { PostServices } from "../services/post.service";
import { AutenticationRequest } from "../middlewares/auth.middleware";
import { json } from "sequelize";

const postServ = new PostServices();

export class PostController {
  async newPost(req: AutenticationRequest, res: Response) {
    try {
      const { id } = req.user!;
      const { title, content, status } = req.body;
      const statusPost = status || "draft";
      const newPost = await postServ.newPost(title, content, statusPost, id);
      return res.status(201).json({ ok: true, newPost });
    } catch (error) {
      console.log("Error in post.controller /newPost/", error);

      return res
        .status(500)
        .json({ ok: false, message: "Error creating post" });
    }
  }

  async getPublicPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Total de post
      const totalPost = await postServ.countPost();
      // Optiene las publicaciones
      const allPublicPosts = await postServ.getPublicPosts(offset, limit);
      // El total de paginas
      const totalPage = Math.ceil(totalPost / limit);

      if (!allPublicPosts) {
        return res.status(400).json({ ok: false, message: "No posts found" });
      }

      return res
        .status(200)
        .json({ ok: true, allPublicPosts, page, limit, totalPost, totalPage });
    } catch (error) {
      console.log("error in post.controller /getPubicPosts/", error);
      return res
        .status(500)
        .json({ ok: false, message: "Error getting posts" });
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.idPost);
      if (isNaN(id)) {
        res.status(400).json({ ok: false, mesaage: "Invalid id" });
      }

      const post = await postServ.getPostById(id);
      if (!post) {
        return res.status(400).json({ ok: false, message: "Post no found" });
      }

      return res.status(200).json({ ok: true, post });
    } catch (error) {
      console.log("Error in post.controller /getPostById/", error);
      return res
        .status(500)
        .json({ ok: false, message: "Error getting the publication" });
    }
  }

  async updatePost(req: AutenticationRequest, res: Response) {
    try {
      const idUser = req.user?.id;
      const idPost = parseInt(req.params.idPost);
      const { title, content, status } = req.body;

      if (isNaN(idPost) || typeof idUser !== "number") {
        return res.status(400).json({ ok: false, message: "Invalid post id" });
      }

      const post = await postServ.getPostByUser(idPost, idUser);

      if (!post) {
        return res.status(404).json({ ok: false, message: "Post no found" });
      }

      if (title) post.title = title;
      if (content) post.content = content;
      if (status) post.status = status;

      const updatePost = await postServ.updatePost(
        idPost,
        title,
        content,
        status
      );
      const getPostUpdate = await postServ.getPostByUser(idPost, idUser);

      return res.status(200).json({ ok: true, getPostUpdate });
    } catch (error) {
      console.log("Error in post.controller /updatePost/", error);
      res.status(500).json({ ok: false, message: "Error updating post" });
    }
  }

  async deletePost(req: AutenticationRequest, res: Response) {
    try {
      const idUser = req.user?.id;
      const idPost = parseInt(req.params.idPost);

      if (isNaN(idPost)) {
        return res.status(400).json({ ok: false, message: "Invalid post id" });
      }

      if (typeof idUser !== "number") {
        return res.status(400).json({ ok: false, message: "Invalid user id" });
      }

      const post = await postServ.getPostByUser(idPost, idUser);

      if (!post) {
        return res.status(400).json({ ok: false, message: "Post not found" });
      }

      const postDeleted = await postServ.deletedPost(idPost, idUser);
      return res
        .status(200)
        .json({ ok: true, message: "Deleted successfully post", postDeleted });
    } catch (error) {
      console.log("Error in post.controlloer /deletePOst/", error);
      return res
        .status(500)
        .json({ ok: false, message: "Error deleting post" });
    }
  }
}
