import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-05';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function countFreshIds(ranges) {
  let freshIdsCount = 0;

  for (let i = 0; i < ranges.length; i++) {
    const [currentMin, currentMax] = ranges[i];
    freshIdsCount += currentMax - currentMin + 1;
  }
  return freshIdsCount;
}

function chekIfOverlapping(range1, range2) {
  const [min1, max1] = range1;
  const [min2, max2] = range2;

  let isOverlapping = false;

  switch (true) {
    // start at the same point
    case min2 === min1: {
      isOverlapping = true;
      break;
    }
    // end at the same point
    case max2 === max1: {
      isOverlapping = true;
      break;
    }
    // one starts where the other ends
    case max2 === min1 || min2 === max1: {
      isOverlapping = true;
      break;
    }
    // one encompasses the other
    case (max2 > max1 && min2 < min1) || (max2 < max1 && min2 > min1): {
      isOverlapping = true;
      break;
    }
    // one range includes beginning of the other
    case min2 < min1 && max2 > min1: {
      isOverlapping = true;
      break;
    }
    // one range includes end of the other
    case max2 > max1 && min2 < max1: {
      isOverlapping = true;
      break;
    }
    default: {
      isOverlapping = false;
    }
  }

  return isOverlapping;
}

function mergeTwoRanges(range1, range2) {
  const [min1, max1] = range1;
  const [min2, max2] = range2;

  const min = Math.min(min1, min2);
  const max = Math.max(max1, max2);

  return [min, max];
}

// create unique ranges to exclude duplicate IDs
function mergeFreshRanges(ranges) {
  // this array will store all merged ranges.
  // every existing range from the puzzle input will be compared against each (merged) range in this array
  let mergedRanges = [ranges[0]];

  for (let i = 1; i < ranges.length; i++) {
    // current range from the puzzle input
    let current = ranges[i];

    for (let j = 0; j < mergedRanges.length; j++) {
      const isOverlapping = chekIfOverlapping(current, mergedRanges[j]);
      if (isOverlapping) {
        // merge ranges
        const merged = mergeTwoRanges(current, mergedRanges[j]);
        // remove old range from the final ranges array
        delete mergedRanges[j];
        // we are now comparing the new merged range against the ranges in mergedRanges array
        current = merged;
      }
    }
    // range has been processed: push current (modified) range into array of final ranges
    mergedRanges.push(current);
    // sanitize mergedRanges, so that it's not sparse
    mergedRanges = mergedRanges.filter(() => true);
  }

  // console.log({ mergedRanges });
  return mergedRanges;
}

function processFreshRanges(data) {
  const processedData = data.split(/\n\n/);

  const freshProducts = processedData[0].split(/\n/).map((freshRange) => {
    return freshRange.split('-').map((el) => Number(el));
  });
  const sortedFresh = freshProducts.sort((a, b) => a[0] - b[0]);

  return {
    sortedFresh,
  };
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const { sortedFresh } = processFreshRanges(data);
    // console.log({ sortedFresh });

    const mergedRanges = mergeFreshRanges(sortedFresh);

    const freshIdsCount = countFreshIds(mergedRanges);
    console.log(freshIdsCount);
    
  } catch (err) {
    console.error(err);
  }
}

await main();
