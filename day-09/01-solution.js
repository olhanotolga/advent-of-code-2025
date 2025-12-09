import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-09';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function calculateArea(xy1, xy2) {
  const [x1, y1] = xy1;
  const [x2, y2] = xy2;

  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
}

function findGreatestArea(coords) {
  let maxArea = 0;

  // take all *unique* possible combinations of two *distinct* coordinates,
  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      // calculate the area between the two dots
      const area = calculateArea(coords[i], coords[j]);
      // console.log(
      //   `Calculated area between ${coords[i]} and ${coords[j]}: ${area}`
      // );
      // compare this area with maxArea; if greater, then reassign maxArea
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}

function processCoordinates(input) {
  const processedCoordinates = input
    .trim()
    .split(/\n/)
    .map((coord) => coord.split(','));

  return processedCoordinates;
}

async function main() {
  try {
    const input = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const processedCoordinates = processCoordinates(input);
    // console.log('processedCoordinates: ', processedCoordinates);

    const greatestArea = findGreatestArea(processedCoordinates);
    console.log('greatestArea: ', greatestArea);
  } catch (err) {
    console.error(err);
  }
}

await main();
