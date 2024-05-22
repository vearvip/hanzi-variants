import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import pMap from 'p-map';
import Queue from 'p-queue'; // 引入p-queue来管理并发队列

const TIMEOUT = 10000;
const CONCURRENCY_LIMIT = 10; // 控制网络请求的并发数
const SAVE_CONCURRENCY_LIMIT = 5; // 控制保存文件的并发数
const queue = new Queue({ concurrency: CONCURRENCY_LIMIT }); // 请求队列
const saveQueue = new Queue({ concurrency: SAVE_CONCURRENCY_LIMIT }); // 保存队列


function getAllHanziCharacters() {
  const unicodeHanziCodeList = [
    ["4E00", "9FA5"], // 基本汉字
    ["9FA6", "9FFF"], // 基本汉字补充
    ["3400", "4DBF"], // 扩展A
    ["20000", "2A6DF"], // 扩展B
    ["2A700", "2B739"], // 扩展C
    ["2B740", "2B81D"], // 扩展D
    ["2B820", "2CEA1"], // 扩展E
    ["2CEB0", "2EBE0"], // 扩展F
    ["30000", "3134A"], // 扩展G
    ["31350", "323AF"], // 扩展H
    ["2EBF0", "2EE5D"], // 扩展I
    ["2F00", "2FD5"], // 康熙部首
    ["2E80", "2EF3"], // 部首扩展
    ["F900", "FAD9"], // 兼容汉字
    ["2F800", "2FA1D"], // 兼容扩展
    ["31C0", "31E3"], // 汉字笔画
    ["2FF0", "2FFF"], // 汉字结构
    ["3105", "312F"], // 汉语注音
    ["31A0", "31BF"], // 注音扩展
    ["3007"], // 〇
  ];
  const characters = [];

  for (const range of unicodeHanziCodeList) {
    let [start, end] = range;
    if (end === undefined) {
      // 处理单个字符
      characters.push(String.fromCodePoint(parseInt(start, 16)));
    } else {
      // 处理字符范围
      for (let code = parseInt(start, 16); code <= parseInt(end, 16); code++) {
        characters.push(String.fromCodePoint(code));
      }
    }
  }

  return characters;
}
const hanziList = getAllHanziCharacters().map(ele => ({
  hanzi: ele
}));


async function fetchHanziData(hanzi) {
  const url = `https://www.zdic.net/hans/${encodeURIComponent(hanzi)}`;
  try {
    const response = await axios.get(url, { timeout: TIMEOUT });
    const $ = cheerio.load(response.data);
  
    // 提取数据  
    const bushou = $('.z_bs2 a').first().text().trim();  
    const bihuaRaw = $('.z_bs2 p:nth-child(3)').text().trim();  
    const bihuaMatch = bihuaRaw.match(/\d+/);  
    const bihua = bihuaMatch ? bihuaMatch[0] : '';   
  

    return { hanzi, bushou, bihua, htmlContent: response.data };
  } catch (error) {
    console.error(`Error fetching data for hanzi: ${hanzi}, ${error}`);
    return { hanzi, error: error.toString() };
  }
}

  
async function savePageToFile(params) {
  const { hanzi, htmlContent } = params;
  const filePath = path.join('./pages', `${hanzi}.html`);
  try {
    await saveQueue.add(() => fs.writeFile(filePath, htmlContent));
    console.log(`Page saved for ${hanzi}`);
  } catch (err) {
    console.error(`Failed to save page for ${hanzi}: ${err}`);
  }
}

async function processAndSaveSingleHanzi(hanziItem) {
  const result = await fetchHanziData(hanziItem.hanzi);
  if (!result.error) {
    console.log(`${hanziItem.hanzi} processed successfully.`);
    await saveQueue.add(() => savePageToFile(result));
  } else {
    console.error(`Failed to process ${hanziItem.hanzi}`);
  }
}

async function processHanziData(hanziList) {
  const hanziPromises = hanziList.map(hanziItem => queue.add(() => processAndSaveSingleHanzi(hanziItem)));

  try {
    await Promise.all(hanziPromises);
    console.log('All hanzi processing and saving completed.');
  } catch (error) {
    console.error('An error occurred during processing or saving:', error);
  }
}

(async () => {
  const hanziList = getAllHanziCharacters();
  await processHanziData(hanziList);

  // 注意：由于保存文件操作被放在了处理流程中，此处不再单独保存结果到JSON文件，
  // 如需保存处理结果，请在processHanziData完成之后添加相应的逻辑。
})();