import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-04';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

async function processPaperRolls(data) {
  let numberOfRollsRemoved = 0;
  const grid = data.split(/\n/).map(row => row.split('').map(col => col === '@' ? 1 : 0));
  // console.log(grid);

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 0) {
        continue;
      }
      
      if (
        ((grid?.[row - 1]?.[col - 1] ?? 0) + (grid?.[row - 1]?.[col] ?? 0) + (grid?.[row - 1]?.[col + 1] ?? 0) +
        (grid[row][col - 1] ?? 0) + (grid[row][col + 1] ?? 0) +
        (grid?.[row + 1]?.[col - 1] ?? 0) + (grid?.[row + 1]?.[col] ?? 0) + (grid?.[row + 1]?.[col + 1] ?? 0)) < 4
      ) {
        numberOfRollsRemoved++;
      }
    }
  }
  return numberOfRollsRemoved;
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });
    const result = await processPaperRolls(data);
    console.log({ result })
  } catch (err) {
    console.error(err);
  }
}

await main();