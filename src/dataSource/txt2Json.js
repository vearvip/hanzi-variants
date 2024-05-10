const fs = require("fs");
const path = require("path");

// Unihan_Variants.txt 文件路径
const unihanVariantsFilePath = path.join(__dirname, "Unihan_Variants.txt");

// 用于存储最终的异体字信息的对象
const variantsJSON = {};

fs.readFileSync(unihanVariantsFilePath, "utf8")
  .split("\n")
  .forEach((line) => {
    // 忽略空行和注释行
    if (line && !line.startsWith("#")) {
      const [codePoint, variantType, variantsString] = line.split("\t");
      const unicodeChar = String.fromCodePoint(
        parseInt(codePoint.slice(2), 16),
      );

      // 只处理定义了变体的行
      if (
        variantType &&
        variantsString &&
        (variantType === "kSimplifiedVariant" ||
          variantType === "kTraditionalVariant" ||
          variantType === "kZVariant")
      ) {
        // 如果之前没有为这个字符创建过变体列表，现在创建
        if (!variantsJSON[unicodeChar]) {
          variantsJSON[unicodeChar] = new Set();
        }

        // 解析变体字符的 Unicode 码点，并添加到变体列表
        variantsString.split(" ").forEach((variantCodePoint) => {
          const variant = String.fromCodePoint(
            parseInt(variantCodePoint.slice(2), 16),
          );
          variantsJSON[unicodeChar].add(variant);
        });
      }
    }
  });

// 将 Set 结构转换为数组，并去除在不同变体字段中可能重复的变体
for (const [char, variantSet] of Object.entries(variantsJSON)) {
  variantsJSON[char] = Array.from(variantSet);
}

// 定义想要输出的 JSON 文件路径
const outputFilePath = path.join(__dirname, "Unihan_Variants.json");

// 将对象写入文件
fs.writeFileSync(outputFilePath, JSON.stringify(variantsJSON, null, 2), "utf8");

console.log("变体字 JSON 文件已创建。");
