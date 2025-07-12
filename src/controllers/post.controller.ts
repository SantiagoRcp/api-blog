import { Request, Response } from "express";
import { PostServices } from "../services/post.service";
import { AutenticationRequest } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";
import { TagService } from "../services/tag.service";
import { Op, where } from "sequelize";
import Tag from "../models/tag.model";
import User from "../models/user.model";
import Category from "../models/category.model";

const tagServ = new TagService();
const catServ = new CategoryService();
const postServ = new PostServices();

export class PostController {
  async newPost(req: AutenticationRequest, res: Response) {
    try {
      const { id } = req.user!;
      const { title, content, status, category_id, tag_ids } = req.body;

      const statusPost = status || "draft";
      const newPost = await postServ.newPost(
        title,
        content,
        statusPost,
        id,
        category_id
      );

      if (Array.isArray(tag_ids) && tag_ids.length > 0) {
        await newPost.setTags(tag_ids);
      }

      const postCreated = await postServ.getPostById(newPost.id);

      //Promoción automática de rol: User → Author
      const totalPostUser = await postServ.getAllPostByUser(id);
      if (totalPostUser.length === 1 && req.user?.role === "User") {
        await User.update({ role: "Author" }, { where: { id } });
        req.user.role = "Author";
      }

      return res.status(201).json({ ok: true, postCreated });
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

      const filter: any = { status: "published" };
      const includeOptions: any[] = [];

      // Filtrar por Categoria
      if (req.query.category) {
        const categorySlug = req.query.category.toString();
        const category = await catServ.categorySlug(categorySlug);

        if (!category) {
          return res
            .status(404)
            .json({ ok: false, message: "Category not found" });
        }
        filter.category_id = category.id;
      }

      // filtrar por etiquetas (tags)
      let tagFilter = undefined;
      if (req.query.tags) {
        const tagSlug = req.query.tags
          .toString()
          .split(",")
          .map((tag) => tag.trim());

        const tags = await tagServ.tagAllBySlug(tagSlug);

        if (tags.length === 0) {
          return res
            .status(404)
            .json({ ok: false, message: "No matching tags found" });
        }
        const tagsIds = tags.map((tag) => tag.id);

        includeOptions.push({
          model: Tag,
          as: "tags",
          where: { id: { [Op.in]: tagsIds } },
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
        });
      } else {
        includeOptions.push({
          model: Tag,
          as: "tags",
          attributes: ["id", "name", "slug"],
          through: { attributes: [] },
        });
      }

      includeOptions.push(
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "username"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        }
      );

      // Total de post
      const totalPost = await postServ.countPost(filter);
      // Optiene las publicaciones
      const allPublicPosts = await postServ.getPublicPosts(
        offset,
        limit,
        filter,
        includeOptions
      );
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
      const { title, content, status, tag_ids, category_id } = req.body;

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
      if (category_id) post.category_id = category_id;

      await postServ.updatePost(idPost, title, content, status);

      if (Array.isArray(tag_ids)) {
        await post.setTags(tag_ids);
      }

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
