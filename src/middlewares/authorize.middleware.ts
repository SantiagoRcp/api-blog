import { NextFunction, Request, Response } from "express";
import { AutenticationRequest } from "./auth.middleware";

export function authorization(roles: string[]) {
  return (req: AutenticationRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    console.log(userRole);
    if (!userRole) {
      return res
        .status(403)
        .json({ ok: false, message: "Forbidden: No role found" });
    }

    // Continue with authorization logic here
    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ ok: false, message: "Forbidden: Insufficient role" });
    }

    next();
  };
}
