import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-04';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

// this function should accept the initial grid,
// it will transform it iteratively with processPaperRolls.
// until there is nothing left to transform (num of removed rolls is 0)
function removeRollsIteratively(grid) {
  grid = grid
    .split(/\n/)
    .map((row) => row.split('').map((col) => (col === '@' ? 1 : 0)));
  // console.log(grid);

  let result = 0;

  let iterationResult;

  do {
    iterationResult = processPaperRolls(grid);
    result += iterationResult;
    // console.log({ iterationResult });
  } while (iterationResult > 0);

  return result;
}

function processPaperRolls(grid) {
  let numberOfRollsRemoved = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 0) {
        continue;
      }

      if (
        (grid?.[row - 1]?.[col - 1] ?? 0) +
          (grid?.[row - 1]?.[col] ?? 0) +
          (grid?.[row - 1]?.[col + 1] ?? 0) +
          (grid[row][col - 1] ?? 0) +
          (grid[row][col + 1] ?? 0) +
          (grid?.[row + 1]?.[col - 1] ?? 0) +
          (grid?.[row + 1]?.[col] ?? 0) +
          (grid?.[row + 1]?.[col + 1] ?? 0) <
        4
      ) {
        grid[row][col] = 0;
        numberOfRollsRemoved++;
      }
    }
  }
  
  return numberOfRollsRemoved;
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });
    const result = removeRollsIteratively(data);
    console.log({ result });
  } catch (err) {
    console.error(err);
  }
}

await main();
