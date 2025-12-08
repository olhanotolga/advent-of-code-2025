import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-07';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

const splits = new Set();

function followTachyonBeamRecursively(row, column, processedData) {
  if (splits.has(`${row},${column}`)) {
    return;
  }
  // beyond edges
  if (row >= processedData.length || column >= processedData[row].length || column < 0) {
    // console.log('End of grid.');
    return;
  }
  // if split character:
  // 1. increment splits
  // 2. call followTachyonBeamRecursively twice with new coordinates: incremented row, adjacent columns
  if (processedData[row][column] === '^') {
    // console.log(`Split at ${row},${column}!`);
    splits.add(`${row},${column}`);
    followTachyonBeamRecursively(row + 1, column - 1, processedData);
    followTachyonBeamRecursively(row + 1, column + 1, processedData);
  }
  // if dot character:
  // 1. call followTachyonBeamRecursively with new coordinates: incremented row, same column
  if (processedData[row][column] === '.') {
    // console.log(`Moving along at ${row},${column}...`);
    followTachyonBeamRecursively(row + 1, column, processedData);
  }
}

function followTachyonBeam(grid, start) {
  const coordinates = new Set();
  coordinates.add(start);

  // as we move down, we loop over each row,
  // we redefine x coordinates that we need to look at
  for (let i = 0; i < grid.length; i++) {
    const currentCoords = new Set(coordinates);
    // look at the character at every col coordinate;
    // if it's '^', remove coordinate in the original set, add adjacent ones
    // console.log({coordinates});
    currentCoords.forEach(val => {
      // console.log(`grid[${i}][${val}]:`, grid[i][val]);
      if (grid[i][val] === '^') {
        splits.add(`${i},${val}`);
        coordinates.delete(val);
        ((val - 1) <= grid[i].length) && coordinates.add(val - 1);
        ((val + 1) <= grid[i].length) && coordinates.add(val + 1);
      }
    })
  }
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

    // with for loop:
    // followTachyonBeam(processedData, startCol);

    // with recursion (start with the next row):
    followTachyonBeamRecursively(1, startCol, processedData);

    console.log('splits:', splits.size);

  } catch (err) {
    console.error(err);
  }
}

await main();
