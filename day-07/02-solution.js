import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-07';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

// memoize returned values and store them in memo
function followTachyonBeamRecursively(row, column, processedData, memo = {}) {
  let numOfTimelines = 0;

  if (`${row},${column}` in memo) {
    // console.log(`Memoized value at ${row},${column}! ${memo[`${row},${column}`]}`);
    return memo[`${row},${column}`];
  }

  // base case + edge detection
  if (
    row >= processedData.length ||
    column >= processedData[row].length ||
    column < 0
  ) {
    // console.log('End of grid.');
    return 1;
  }

  // if split character:
  // 1. call followTachyonBeamRecursively twice with new coordinates: incremented row, adjacent columns
  // 2. assign return values to respective keys in the memo object
  // 3. recalculate number of timelines
  if (processedData[row][column] === '^') {
    // console.log(`Split at ${row},${column}!`);

    const timelinesLeft = followTachyonBeamRecursively(
      row + 1,
      column - 1,
      processedData,
      memo
    );
    memo[`${row + 1},${column - 1}`] = timelinesLeft;
    numOfTimelines += timelinesLeft;

    const timelinesRight = followTachyonBeamRecursively(
      row + 1,
      column + 1,
      processedData,
      memo
    );
    memo[`${row + 1},${column + 1}`] = timelinesRight;
    numOfTimelines += timelinesRight;
  }

  // if dot character:
  // 1. call followTachyonBeamRecursively with new coordinates: incremented row, same column
  // 2. assign return value to respective key in the memo object
  // 3. recalculate number of timelines
  if (processedData[row][column] === '.') {
    // console.log(`Just moving down at ${row},${column}...`);
    const timelinesDown = followTachyonBeamRecursively(
      row + 1,
      column,
      processedData,
      memo
    );
    memo[`${row + 1},${column}`] = timelinesDown;
    numOfTimelines += timelinesDown;
  }

  return numOfTimelines;
}

function processData(data) {
  const processedData = data.split(/\n/);
  // console.log({
  //   rows: processedData.length,
  //   columns: processedData[0].length,
  // })

  const startCol = processedData[0].indexOf('S');

  if (startCol < 0 || startCol >= processedData[0].length) {
    throw new Error('Invalid start coordinates');
  }

  return { processedData, startCol };
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const { processedData, startCol } = processData(data);

    const numOfTimelines = followTachyonBeamRecursively(
      1,
      startCol,
      processedData
    );

    console.log('numOfTimelines:', numOfTimelines);
  } catch (err) {
    console.error(err);
  }
}

await main();
