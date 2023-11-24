import { generateRandomToken } from './src/utils/generateRandomToken.js';

let oldNumbers = [];

let times = [];

for(let i = 0; i < 10000; i++){
  let number = generateRandomToken(12);
  if(!oldNumbers.includes(number)){
    oldNumbers.push(number);
  }
  else {
    times.push(i);
  }
};

console.log(times.length, times);