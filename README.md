# hanzi-variants

查询汉字的异体字 
这个npm包提供了查询汉字异体字的功能，基于[Unihan](https://www.unicode.org/charts/unihan.html)数据库的数据。

在这里下载[Unihan.zip](https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip)原始数据

## 安装

使用npm安装该包：

```bash
npm install @vearvip/hanzi-variants
```
## 使用方法
```js
import { queryVariant } from '@vearvip/hanzi-variants';

// 示例：查询汉字 '说' 的异体字
const character = '说';

const variants = queryVariant(character);

console.log(`"${character}" 的异体字有：`, variants);
// "说" 的异体字有： [ "說", "説" ]

```
## API
queryVariant(character: string): Array | undefined
- character: string - 需要查询的单个汉字。
- 返回值: Array 或 undefined - 一个数组，包含了字符的异体字。如果查询的字符不存在于数据库中，则返回undefined。

## 许可证
本项目采用MIT许可证 - 详情请参见LICENSE文件。