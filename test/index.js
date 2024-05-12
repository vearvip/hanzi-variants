import { queryVariant } from '../src/index.js';


const character = '说';
const variants = queryVariant(character);

console.log(`"${character}" 的异体字有：`, variants);