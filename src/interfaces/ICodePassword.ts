export interface ICodePassword {
  id?: number;
  user_id: number;
  code: string;
  expires_at: Date;
  created_at?: Date;
}
