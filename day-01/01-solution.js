import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import process from 'node:process';

import { range } from '../utils/range.js';

const CURRENT_DIR = 'day-01';
const INPUT_FILE = '01-input.txt';

const DIAL = Array.from(range(100));
console.log({ DIAL });
const LENGTH = DIAL.length;
const STARTING_POS_IDX = 50;
const TARGET_NUM = 0;

let currentPosIdx = STARTING_POS_IDX;
let count = 0;

// because remainder in JS is not the same as modulo:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
// by definition, modulo result always has the same sign as the divisor,
// and this is what I aim here for
function getModulo(dividend, divisor) {
  return ((dividend % divisor) + divisor) % divisor;
}

async function processInstruction(instruction) {
  const direction = instruction[0];
  let distance;
  switch (direction) {
    case 'R': {
      distance = instruction.slice(1) * 1;
      break;
    }
    case 'L': {
      distance = instruction.slice(1) * -1;
      break;
    }
  }
  // console.log({direction, distance});
  currentPosIdx = getModulo(currentPosIdx + distance, LENGTH);
  // console.log('current position index:', currentPosIdx);
  if (DIAL[currentPosIdx] === TARGET_NUM) {
    count++;
  }
}

async function main() {
  try {
    const filePath = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let linesCount = 0;

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      linesCount++;
      await processInstruction(trimmed);
    }

    rl.close();
    console.log({ linesCount });
  } catch (err) {
    console.error(err);
  }
}

await main();

console.log({ count });
