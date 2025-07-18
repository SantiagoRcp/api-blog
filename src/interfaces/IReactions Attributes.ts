export interface IReactionsAttributes {
  id: number;
  user_id: number;
  post_id: number;
  type: "like" | "dislike" | "love";
  createdAt: Date;
  updatedAt: Date;
}
