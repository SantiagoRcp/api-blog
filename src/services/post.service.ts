import Category from "../models/category.model";
import Post from "../models/Post.model";
import Tag from "../models/tag.model";
import User from "../models/user.model";

export class PostServices {
  async newPost(title: string, content: string, status: string, author_id: number, category_id: number) {
    const newPost = await Post.create({
      title,
      content,
      status,
      author_id,
      category_id,
    });
    return newPost;
  }

  async getPublicPosts(offset: number, limit: number, filter: any, includeOptions: any) {
    const getPublicPosts = await Post.findAll({
      where: filter,
      attributes: ["id", "title", "status", "createdAt"],
      include: includeOptions,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return getPublicPosts;
  }

  async countPost(filter: any) {
    const totalPost = await Post.count({ where: filter });
    return totalPost;
  }

  async getPostById(id: number) {
    const post = await Post.findByPk(id, {
      attributes: ["id", "title", "content", "status", "createdAt"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "username"],
        },
        { model: Tag, as: "tags", attributes: ["id", "name", "slug"] },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });
    return post;
  }

  async updatePost(id: number, title: string, content: string, status: string) {
    const updatePost = await Post.update(
      { title, content, status }, // fields to update
      { where: { id } } // update condition
    );

    return updatePost;
  }

  async getPostByUser(idPost: number, idUser: number) {
    const post = await Post.findOne({
      where: { id: idPost, author_id: idUser },
      attributes: ["id", "title", "content", "status", "createdAt"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "username"],
        },
        { model: Tag, as: "tags", attributes: ["id", "name", "slug"] },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });
    return post;
  }

  async getAllPostByUser(idUser: number) {
    const totalPost = await Post.findAll({where:{id: idUser}});
    return totalPost;
  }

  async deletedPost(idPost: number, idUser: number) {
    const postDeleted = await Post.destroy({
      where: { id: idPost, author_id: idUser },
    });
    return postDeleted;
  }
}
