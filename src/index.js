import unihanVariantsData from "./dataSource/Unihan_Variants.json" assert { type: "json" };

// 查询特定汉字的异体字，自动加载数据
export function queryVariant(character) { 
  // 返回查询结果，若无结果则返回undefined
  return unihanVariantsData[character]
}
