import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { range as getRange } from '../utils/range.js';

const CURRENT_DIR = 'day-02';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function findIncorrectIds(arrayOfIndices) {
  let sumOfIncorrectIndices = 0;
  const regex = /^(\d+)\1$/;
  arrayOfIndices.forEach((index) => {
    if (regex.test(index)) {
      // console.log(index);
      sumOfIncorrectIndices += Number(index);
    }
  });

  return sumOfIncorrectIndices;
}

function processData(data) {
  const processedData = data
    .split(',')
    .map((range) => {
      const [from, to] = range.split('-');
      return Array.from(getRange(Number(from), Number(to) + 1));
    })
    .flat()
    .map((index) => index.toString())
    // get rid of strings that cannot consist of two same sequences
    .filter((index) => index.length % 2 === 0);

  const sumOfIncorrectIndices = findIncorrectIds(processedData);
  console.log('sumOfIncorrectIndices:', sumOfIncorrectIndices);
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });
    processData(data);
  } catch (err) {
    console.error(err);
  }
}

await main();
