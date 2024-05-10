// unihanVariants.mjs

import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// 获取当前文件所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 异体字数据文件路径
const variantsJsonPath = join(__dirname, "./dataSource/Unihan_Variants.json");

// 缓存对象，防止重复加载
let variantsCache = null;

// 异步加载并缓存数据
async function loadVariantData() {
  // 如果缓存为空则从文件加载
  if (!variantsCache) {
    try {
      const data = await fs.readFile(variantsJsonPath, "utf-8");
      variantsCache = JSON.parse(data);
    } catch (error) {
      console.error(`加载数据时出错: ${error}`);
      throw error;
    }
  }
  return variantsCache;
}

// 查询特定汉字的异体字，自动加载数据
export async function queryVariant(character) {
  // 确保数据已加载
  const data = await loadVariantData();

  // 返回查询结果，若无结果则返回空数组
  return data[character] || [];
}
