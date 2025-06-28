import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  userId: number;
  name: string;
  username: string;
  role: string;
}

export function generateToken(tokenPayload: TokenPayload): string {
  const { userId, name, username, role } = tokenPayload;

  const JWT_SECRET = process.env.JWT_SECRET || "qwsdfghjklsdfghjklqweasdfm";
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

  const payload = { id: userId, name, username, role };
  const tokenOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] };

  const token: string = jwt.sign(payload, JWT_SECRET, tokenOptions);

  return token;
}
