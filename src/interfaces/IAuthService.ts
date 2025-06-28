import User from "../models/user.model";

export interface IAuthServices {
  id?: number;
  name: string;
  username: string;
  email: string;
  password: string;
  profileimage?: string;
  interests?: string;
  role: "User" | "Author" | "Admin";
  loginAttempts: number;
  lockUntil: Date | null;
}

export interface IAuthService {
  registerUser(dataUser: IAuthServices): Promise<IAuthServices>;
  findUserByEmail(email: string): Promise<User | null>;
}
