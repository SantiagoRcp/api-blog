import { Request, Response } from "express";
import { AutenticationRequest } from "../middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import User from "../models/user.model";
import { ValidationError } from "sequelize";

const userServ = new UserService();

export class UserController {
  async getProfile(req: AutenticationRequest, res: Response) {
    try {
      const { id } = req.user!;
      const user = await userServ.getUser(id);

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      return res.status(200).json({ ok: true, message: user });
    } catch (error) {
      console.log(`error en getProfile.controller ${error}`);
      return res
        .status(400)
        .json({ ok: false, message: "Error getting profile" });
    }
  }

  async getAllUsers(req: AutenticationRequest, res: Response) {
    try {
      const users = await userServ.getAllUser();
      if (!users) {
        return res.status(400).json({ ok: false, message: "Users not found." });
      }

      return res.status(200).json({ ok: true, users });
    } catch (error) {
      console.log(`error en getAllUser.controller ${error}`);
      return res
        .status(400)
        .json({ ok: false, message: "Error getting Users" });
    }
  }

  async updateUser(req: AutenticationRequest, res: Response) {
    try {
      const { id } = req.user!;
      const user = await userServ.getUser(id);

      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      const { name, username, interests, profileimage } = req.body;

      if (username && username !== user.username) {
        const exixtuser = await User.findOne({ where: { username } });
        if (exixtuser) {
          res
            .status(400)
            .json({ ok: false, message: "The username is already in use" });
        }
        user.username = username;
      }

      if (name) user.name = name;
      if (interests) user.interests = interests;
      if (profileimage) user.profileimage = profileimage;

      await user.save();

      const { password, loginAttempts, lockUntil, ...safeUser } = user.toJSON();
      res.status(200).json({ ok: true, safeUser });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          ok: false,
          message: "Validation error",
          errors: error.errors,
        });
      }

      console.error("Error en updateProfile:", error);
      return res.status(500).json({
        ok: false,
        message: "Error al actualizar el perfil",
      });
    }
  }

  async deleteUser(req: AutenticationRequest, res: Response) {
    try {
      const { id } = req.user!;

      const deleteUser = await User.findByPk(id);
      if (!deleteUser) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      await User.destroy({ where: { id } });
      return res.status(200).json({ ok: true, message: "Delete User" });
    } catch (error) {
      console.log("Error in deleteUser.controller");
      return res
        .status(500)
        .json({ ok: false, message: "Error deleting account" });
    }
  }
}
