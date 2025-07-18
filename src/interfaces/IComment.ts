export default interface IComment {
  id: number;
  content: string;
  author_id: number;
  post_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}
