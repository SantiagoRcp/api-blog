import Comment from "../models/comment.model";
import User from "../models/user.model";

export class CommentServices {
  async getCommentById(id_comment: number) {
    const comment = await Comment.findByPk(id_comment, {
      attributes: ["id", "content", "createdAt"],
      include: {
        model: User,
        as: "author",
        attributes: ["id", "name", "username"],
      },
    });

    return comment;
  }

  async getComment(id_comment: number){
    const comment = await Comment.findByPk(id_comment);
    return comment
  }

  async getAllCommentPost(post_id: number) {
    const comments = await Comment.findAll({
      where: { post_id },
      order: [["createdAt", "ASC"]],
      attributes: ["id", "content", "createdAt"],
      include: {
        model: User,
        as: "author",
        attributes: ["id", "name", "username"],
      },
    });

    return comments;
  }

  async newComment(author_id: number, post_id: number, content: string) {
    const comment = await Comment.create({ author_id, content, post_id });
    return comment;
  }
}
