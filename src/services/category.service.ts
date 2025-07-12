import Category from "../models/category.model";

export class CategoryService {
  //
  async getCategoryById(id: number) {
    const category = await Category.findByPk(id);
    return category;
  }

  //
  async getAllCategories() {
    const categories = await Category.findAll({
      attributes: ["id", "name", "slug"],
    });

    return categories;
  }

  //
  async existCategory(name: string) {
    const category = await Category.findOne({ where: { name } });
    return category;
  }

  //
  async newCategory(name: string, slug: string) {
    const category = Category.create({ name, slug });
    return category;
  }

  async categorySlug(slug: string) {
    const category = await Category.findOne({ where: { slug } });
    return category;
  }
}
