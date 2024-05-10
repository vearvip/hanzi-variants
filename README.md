# hanzi-variants

查询汉字的异体字 
这个npm包提供了查询汉字异体字的功能，基于Unihan数据库的数据。


## 安装

使用npm安装该包：

```bash
npm install @vearvip/hanzi-variants
```
## 使用方法
```js
import { queryVariant } from '@vearvip/hanzi-variants';

// 示例：查询汉字 '说' 的异体字
async function demo() {
    const character = '说';
    try {
        const variants = await queryVariant(character);
        console.log(`"${character}" 的异体字有：`, variants);
    } catch (error) {
        console.error('查询异体字时出错：', error);
    }
}

demo();
// "说" 的异体字有： [ "說", "説" ]

```
## API
async queryVariant(character)
查询指定汉字的异体字。

### 参数：

character (string): 要查询异体字的汉字字符。

### 返回值：

一个Promise，解析为一个数组，包含了找到的所有异体字；如果没有发现异体字，返回空数组。

## 许可证
本项目采用MIT许可证 - 详情请参见LICENSE文件。