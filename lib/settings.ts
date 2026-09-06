import prisma from "./prisma";
import { DEFAULT_CATEGORIES } from "./constants";

export const CATEGORIES_SETTING_KEY = "blog_categories";

export async function getActiveCategories(): Promise<string[]> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: CATEGORIES_SETTING_KEY },
    });

    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading categories from database:", err);
  }

  return DEFAULT_CATEGORIES;
}

export async function saveActiveCategories(categories: string[]): Promise<boolean> {
  try {
    const cleanList = categories
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (cleanList.length === 0) return false;

    await prisma.setting.upsert({
      where: { key: CATEGORIES_SETTING_KEY },
      update: { value: JSON.stringify(cleanList) },
      create: { key: CATEGORIES_SETTING_KEY, value: JSON.stringify(cleanList) },
    });

    return true;
  } catch (err) {
    console.error("Error saving categories to database:", err);
    return false;
  }
}
