import User from "../models/user.model";

export class UserService {
  async getUser(id: number) {
    const exclude = ["password", "loginAttempts", "lockUntil"];
    const user = await User.findByPk(id, { attributes: { exclude } });
    return user;
  }

  async getAllUser() {
    const exclude = ["password", "loginAttempts", "lockUntil"];
    const users = await User.findAll({ attributes: { exclude } });
    return users;
  }
}
