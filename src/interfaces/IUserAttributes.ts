export interface UserAttributes {
  id: number;
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

