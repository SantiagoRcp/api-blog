import User from "../models/user.model";
import { IAuthService, IAuthServices } from "../interfaces/IAuthService";

export class AuthServices implements IAuthService {
  async registerUser(dataUser: IAuthServices): Promise<User> {
    const { username, email, password } = dataUser;

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new Error("User already exists with this email");

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername)
      throw new Error("User already exists with this username");

    // Create a new user
    const newUser = await User.create({ ...dataUser });

    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}
