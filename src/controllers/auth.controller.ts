import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { AuthServices } from "../services/auth.service";
import { PasswordResetService } from "../services/passwordReset.service";
import { EmailServices } from "../services/email.service";
import { generateToken } from "../utils/generateToken";

const authService = new AuthServices();
const passResetCodeServ = new PasswordResetService();
const emailSend = new EmailServices();

export class AuthController {
  private static MAX_ATTEMPTS = 3;
  private static LOCK_TIME_MINUTES = 3;
  private static LOCK_TIME = AuthController.LOCK_TIME_MINUTES * 60 * 1000;
  private static MINCODE = 10000000;
  private static MAXCODE = 99999999;

  async register(req: Request, res: Response) {
    const { name, username, password, email, role, interests, profileimage } =
      req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const dataUser = {
      name,
      username,
      password: hashedPassword,
      email,
      role: role || "User",
      interests,
      profileimage,
      loginAttempts: 0,
      lockUntil: null,
    };

    try {
      const newUser = await authService.registerUser(dataUser);
      const { id, name, username, email, role, interests, profileimage } =
        newUser;
      return res.status(201).json({
        ok: true,
        message: "User registered successfully",
        user: { id, name, username, email, role, interests, profileimage },
      });
    } catch (error) {
      console.log("\nError in register", error);
      if (error instanceof Error) {
        return res.status(400).json({ ok: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({ ok: false, message: "Internal server error" });
      }
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      // Check if the user is locked out
      if (user.lockUntil && user.lockUntil > new Date()) {
        const minutesLeft =
          Math.ceil(user.lockUntil.getTime() - Date.now()) / 1000;

        return res.status(429).json({
          ok: false,
          message: `Too many login attempts. Please try again after ${Math.ceil(
            minutesLeft
          )} seconds.`,
        });
      }

      const isPassword = await bcrypt.compare(password, user.password);

      if (!isPassword) {
        if (user.loginAttempts >= AuthController.MAX_ATTEMPTS) {
          const locked = new Date(
            new Date().getTime() + AuthController.LOCK_TIME
          );
          user.lockUntil = locked;
          await user.save();

          return res.status(429).json({
            ok: false,
            message: `Too many login attempts. Please try again after
             ${AuthController.LOCK_TIME_MINUTES} minutes.`,
          });
        }

        user.loginAttempts += 1;
        await user.save();
        return res
          .status(401)
          .json({ ok: false, message: "Invalid credentials" });
      }

      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();

      const payload = {
        userId: user.id ? user.id : 0,
        name: user.name,
        username: user.username,
        role: user.role,
      };

      const token = generateToken(payload);
      return res.status(200).json({
        ok: true,
        message: "User logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          profileimage: user.profileimage,
          interests: user.interests,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log("\nError in Login", error);
      if (error instanceof Error) {
        return res.status(400).json({ ok: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({ ok: false, message: "Internal server error" });
      }
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      await passResetCodeServ.deleteCode(user.id);

      const newCode = Math.floor(
        AuthController.MINCODE + Math.random() * AuthController.MAXCODE
      ).toString();

      const expires_at = new Date(Date.now() + 8 * 60 * 1000); //expira en 8 minutos
      const code = { user_id: user.id, code: newCode, expires_at };

      await passResetCodeServ.createResetCode(code);
      await emailSend.sendPasswordResetEmail(user.email, user.name, newCode);

      res
        .status(200)
        .json({ ok: true, message: `Email sent to the registered email` });
    } catch (error) {
      console.log("\nError in forgotPassword", error);
      if (error instanceof Error) {
        return res.status(400).json({ ok: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({ ok: false, message: "Internal server error" });
      }
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email, code, newPassword } = req.body;
    try {
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }

      const userCode = await passResetCodeServ.findCode(user.id, code);
      if (!userCode) {
        return res.status(400).json({ ok: false, message: "The wrong code" });
      }

      if (userCode.expires_at < new Date()) {
        return res
          .status(400)
          .json({ ok: false, message: "The code has expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      await passResetCodeServ.deleteCode(user.id);

      return res.status(200).json({
        ok: true,
        message: "The password has been updated successfully",
      });
    } catch (error) {
      console.log("\nError in resetPassword", error);
      if (error instanceof Error) {
        return res.status(400).json({ ok: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({ ok: false, message: "Internal server error" });
      }
    }
  }
}
