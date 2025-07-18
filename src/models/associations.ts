import Post from "./Post.model";
import User from "./user.model";
import Category from "./category.model";
import Tag from "./tag.model";
import Comment from "./comment.model";

// Post - User
Post.belongsTo(User, { foreignKey: "author_id", as: "author" });
User.hasMany(Post, { foreignKey: "author_id", as: "posts" });

// Post - Category
Post.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(Post, { foreignKey: "category_id", as: "Posts" });

// Post - Tag (Many to Many)
Post.belongsToMany(Tag, {through: "PostTags", as: "tags", foreignKey:"post_id",});
Tag.belongsToMany(Post, {through: "PostTags", as: "posts", foreignKey: "tag_id"});

// Relaciones de comentarios
Comment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'author_id', as: 'author' });
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });