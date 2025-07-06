import Post from "../models/Post.model";
import User from "../models/user.model";

export class PostServices {
  async newPost(title: string, content: string, status: string, author_id: number) {
    const newPost = await Post.create({ title, content, status, author_id });
    return newPost;
  }

  async getPublicPosts(offset: number, limit: number) {
    const getPublicPosts = await Post.findAll({
      where: { status: "published" },
      attributes:["id", "title", "status", "createdAt"],
      include: [
        { model: User, as: "author", attributes: ["id", "name", "username"] }
      ],
      order:[["createdAt", "DESC"]],
      limit,
      offset
    });

    return getPublicPosts
  }

  async countPost(){
    const totalPost = await Post.count({where: {status: "published"}});
    return totalPost;
  }

  async getPostById(id: number){
    const post = await Post.findOne({
      where: { id, status: "published" },
      attributes: ["id", "title", "content", "status", "createdAt"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "username"],
        },
      ],
    });
    return post;
  }
  
  async updatePost(id: number, title: string, content: string, status: string){
    const updatePost = await Post.update(
      { title, content, status }, // fields to update
      { where: { id } } // update condition
    );
  
    return updatePost;
  }

  async getPostByUser(idPost: number, idUser: number){
    const post = await Post.findOne({
      where: { id: idPost, author_id: idUser },
      attributes: ["id", "title", "content", "status", "createdAt"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "username"],
        },
      ],
    });
    return post;
  }

  async deletedPost(idPost: number, idUser: number){
    const postDeleted = await Post.destroy({where:{id: idPost, author_id: idUser}});
    return postDeleted;
  }
}
