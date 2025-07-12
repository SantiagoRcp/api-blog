import Tag from "../models/tag.model";

export class TagService {
  async existTag(name: string) {
    const exist = await Tag.findOne({ where: { name } });
    return exist;
  }

  async newTag(name: string, slug: string) {
    const tag = await Tag.create({ name, slug });
    return tag;
  }

  async getTags() {
    const tags = await Tag.findAll({ attributes: ["id", "name", "slug"] });
    return tags;
  }

  async getTagById(id: number) {
    const tag = await Tag.findByPk(id, { attributes: ["id", "name", "slug"] });
    return tag;
  }

  async tagAllBySlug(tagSlug: string[]) {
    const tags = await Tag.findAll({ where: { slug: tagSlug } });
    return tags;
  }
}
