import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import process from 'node:process';

import { range } from '../utils/range.js';

const CURRENT_DIR = 'day-01';
const INPUT_FILE = '01-input.txt';

const DIAL = Array.from(range(100));
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

  // how many times is 0 clicked?

  // utility variable
  const newRelativePosition = currentPosIdx + distance;
  const numOfRotations = Math.abs(newRelativePosition) / LENGTH;
  
    // did one rotation, the end position is 0
    if (newRelativePosition === TARGET_NUM) {
      count++;
    } // going backwards, passing 0
    else if (newRelativePosition < TARGET_NUM) {
      count += Math.ceil(numOfRotations);
      // we started at 0, so let's remove that false positive
      if (currentPosIdx === TARGET_NUM) {
        count--;
      }
    } // going backward, not passing 0; OR going forward
    else {
      count += Math.floor(numOfRotations);
      // 
      if (Math.abs(newRelativePosition) % LENGTH === 0 ) {
        count--;
      }
    }
  

  // recalculating current position
  currentPosIdx = getModulo(newRelativePosition, LENGTH);
  
  // dealing with the case not included above
  // and the recalculated current position
  if (newRelativePosition !== TARGET_NUM) {
    if (currentPosIdx === TARGET_NUM) {
      count++;
    }
    
  }
  
  console.log('current position index:', currentPosIdx, 'current count:', count);
  
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
