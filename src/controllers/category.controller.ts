import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

const categoryServ = new CategoryService();

export class CategoryController {
  async newCategory(req: Request, res: Response) {
    try {
      const { name, slug } = req.body;
      const existCategory = await categoryServ.existCategory(name);

      if (existCategory) {
        return res
          .status(400)
          .json({ ok: false, message: "The category already exists" });
      }

      const newCategory = await categoryServ.newCategory(name, slug);
      return res
        .status(200)
        .json({
          ok: true,
          message: "category created successfully",
          newCategory,
        });
    } catch (error) {
      console.log("Error in category.controller /newCategory/", error);
      return res
        .status(500)
        .json({ ok: false, message: "Error creating category" });
    }
  }

  async getCategory(req: Request, res: Response) {
    const id = parseInt(req.params.idCategory);
    if (isNaN(id)) {
      return res.status(400).json({ ok: false, mesaage: "Invalid id" });
    }

    const category = await categoryServ.getCategoryById(id);
    
    if (!category) {
      return res.status(404).json({ ok: false, message: "Category not found" });
    }

    return res.status(200).json({ ok: true, category });
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoryServ.getAllCategories();
      if (!categories) {
        return res
          .status(404)
          .json({ ok: false, mesage: "there are no categories" });
      }

      return res.status(200).json({ ok: true, categories });
    } catch (error) {}
  }
}
