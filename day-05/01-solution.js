import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-05';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function findFreshProducts(fresh, available) {
  let freshCount = 0;

  for (let i = 0; i < available.length; i++) {
    const availableToCheck = available[i];
    // console.log('availableToCheck:', availableToCheck)
    for (let j = 0; j < fresh.length; j++) {
      const [currentMin, currentMax] = fresh[j];
      // console.log([currentMin, currentMax]);
      if (availableToCheck >= currentMin && availableToCheck <= currentMax) {
        // console.log(
        //   'bang!',
        //   `${availableToCheck} is in ${[currentMin, currentMax]} range`
        // );
        freshCount++;
        break;
      }
    }
  }

  return freshCount;
}

function processData(data) {
  const processedData = data.split(/\n\n/);

  const freshProducts = processedData[0].split(/\n/).map((freshRange) => {
    return freshRange.split('-').map((el) => Number(el));
  });
  const sortedFresh = freshProducts.sort((a, b) => a[0] - b[0]);

  const availableProducts = processedData[1]
    .split(/\n/)
    .map((id) => Number(id));

  // console.log('data:', {sortedFresh, availableProducts})
  return {
    sortedFresh,
    availableProducts,
  };
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const { sortedFresh, availableProducts } = processData(data);
    // console.log({ sortedFresh, availableProducts });

    const freshProductCount = findFreshProducts(sortedFresh, availableProducts);

    console.log(freshProductCount);
  } catch (err) {
    console.error(err);
  }
}

await main();
