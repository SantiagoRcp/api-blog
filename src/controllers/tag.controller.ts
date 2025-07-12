import { Request, Response } from "express";
import { TagService } from "../services/tag.service";
import { json } from "sequelize";

const tagServ = new TagService();

export class TagController {
  async newTag(req: Request, res: Response) {
    try {
      const { name, slug } = req.body;
      const existTag = await tagServ.existTag(name);
      if (existTag) {
        return res.status(400).json({ ok: false, message: "Existing tag" });
      }

      const tag = await tagServ.newTag(name, slug);
      return res
        .status(201)
        .json({ ok: true, message: "Tag created successfully", tag });
    } catch (error) {
      console.log("Error in TagController / newTag /", error);
      return res.status(500).json({ ok: false, message: "error creating tag" });
    }
  }

  async getTags(req: Request, res: Response) {
    try {
      const tags = await tagServ.getTags();
      if (!tags) {
        return res.status(400).json({ ok: false, message: "there are no tag" });
      }

      return res.status(200).json({ ok: false, tags });
    } catch (error) {
      console.log("Error in TagController / getTag /", error);
      return res.status(500).json({ ok: false, message: "error getting tags" });
    }
  }
}
