import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-09';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function calculateArea(coord1, coord2) {
  const [col1, row1] = coord1;
  const [col2, row2] = coord2;

  return (Math.abs(col1 - col2) + 1) * (Math.abs(row1 - row2) + 1);
}

function checkIfSideIsWithinRange(rangePoints, sidePoints) {
  const [r1, r2] = rangePoints;
  const [p1, p2] = sidePoints;
  if (Math.min(p1, p2) >= r1 && Math.max(p1, p2) <= r2) {
    return true;
  }
  return false;
}

function findGreatestArea(coords, rowsAndColumns) {
  const { extendedRows, extendedColumns } = rowsAndColumns;

  let maxArea = 0;

  // take all *unique* possible combinations of two *distinct* coordinates,
  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const coordOne = coords[i];
      const coordTwo = coords[j];
      // console.log({
      //   coordOne,
      //   coordTwo,
      // });
      const [x1, y1] = coordOne;
      const [x2, y2] = coordTwo;

      if (x1 === x2 || y1 === y2) {
        const area = calculateArea(coordOne, coordTwo);
        if (area > maxArea) {
          console.log(
            `New max area between ${coordOne} and ${coordTwo}: ${area}`
          );
          maxArea = area;
        }
      } else {
        /*  create extra coordinates and check distances between them and each of the given coords:
        const extraOne = [x1, y2];
        const extraTwo = [x2, y1];
        */

        // coordOne & extraOne ([x1, y1] and [x1, y2])
        const firstCheckPassed = checkIfSideIsWithinRange(extendedColumns[x1], [
          y1,
          y2,
        ]);
        if (!firstCheckPassed) {
          // console.log(`1: No rectangle possible between {${coordOne}} and {${coordTwo}}...`);
          continue;
        }

        // coordOne & extraTwo ([x1, y1] and [x2, y1])
        const secondCheckPassed = checkIfSideIsWithinRange(extendedRows[y1], [
          x1,
          x2,
        ]);
        if (!secondCheckPassed) {
          // console.log(`2: No rectangle possible between {${coordOne}} and {${coordTwo}}...`);
          continue;
        }

        // coordTwo & extraOne ([x2, y2] and [x1, y2])
        const thirdCheckPassed = checkIfSideIsWithinRange(extendedRows[y2], [
          x1,
          x2,
        ]);
        if (!thirdCheckPassed) {
          // console.log(`3: No rectangle possible between {${coordOne}} and {${coordTwo}}...`);
          continue;
        }

        // coordTwo & extraTwo ([x2, y2] and [x2, y1])
        const fourthCheckPassed = checkIfSideIsWithinRange(
          extendedColumns[x2],
          [y1, y2]
        );
        if (!fourthCheckPassed) {
          // console.log(`4: No rectangle possible between {${coordOne}} and {${coordTwo}}...`);
          continue;
        }

        const area = calculateArea(coordOne, coordTwo);
        if (area > maxArea) {
          console.log(
            `New max area between ${coordOne} and ${coordTwo}: ${area}`
          );
          maxArea = area;
        }
      }
    }
  }

  return maxArea;
}

function unshiftOrPushToTuple(arr, val2) {
  // console.log({arr, val2});
  if (arr === undefined) {
    return [val2];
  }
  const existingValue = arr[0];
  if (val2 > existingValue) {
    arr.push(val2);
  } else {
    arr.unshift(val2);
  }
  return arr;
}

// get ranges for vertical (columns) and horizontal (rows) distances between adjacent coordinates (red tiles)
function getRowsAndColumns(coordinates) {
  // each row will contain 2 col values and each column will contain 2 row values
  const rows = {};
  const columns = {};

  for (let i = 0; i < coordinates.length; i++) {
    const current = coordinates[i];
    const [col, r] = current;
    rows[r] = unshiftOrPushToTuple(rows[r], col);
    columns[col] = unshiftOrPushToTuple(columns[col], r);
  }

  return { rows, columns };
}

function recalculateRange(
  rangePoints,
  currentRowOrColumn,
  rowOrColumnKeys,
  rowsOrColumns
) {
  const [a, b] = rangePoints;
  // we initialize the range as the old one and will reassign if necessary
  const newCurrentRange = [Math.min(a, b), Math.max(a, b)];
  const potentialRangePoints = [];
  // if we are extending the row, we are looking for potential columns (x coordinates) to include in the range.
  // for this, we are checking which columns have ranges that include the current row coordinate
  // it's the same with extending columns but the other way around.
  for (let c = 0; c < rowOrColumnKeys.length; c++) {
    // console.log({c: rowOrColumnKeys[c]});
    const rowOrColumnIndex = Number(rowOrColumnKeys[c]);
    if (rowOrColumnIndex === a || rowOrColumnIndex === b) {
      continue;
    }
    const [foundRangeMin, foundRangeMax] = rowsOrColumns[rowOrColumnIndex];
    // console.log({foundRangeMin, foundRangeMax});
    if (
      currentRowOrColumn < foundRangeMax &&
      currentRowOrColumn > foundRangeMin
    ) {
      // within range!
      potentialRangePoints.push(rowOrColumnIndex);
    }
  }
  // console.log('potentialRangePoints: ', potentialRangePoints);

  // if there are no more points to extend to, we just do nothing
  // otherwise we check if and how exactly we'll extend
  if (potentialRangePoints.length === 0) {
    return null;
  }
  // the rule would be:
  // we assign each point either to left (smaller values) or right (greater values) from the current range [newCurrentRange[0], newCurrentRange[1]]
  // - if there is an even number of points to either side, we skip
  // - if there is an odd number of points to either side, we extend the range to the "closest" point on the respective side
  const left = [];
  const right = [];
  potentialRangePoints.forEach((p) => {
    p < newCurrentRange[0] && left.push(p);
    p > newCurrentRange[1] && right.push(p);
  });

  if (left.length % 2 === 1) {
    newCurrentRange[0] = left.sort()[left.length - 1];
  }
  if (right.length % 2 === 1) {
    newCurrentRange[1] = right.sort()[0];
  }

  return [newCurrentRange[0], newCurrentRange[1]];
}

// get vertical (columns) and horizontal (rows) distances extended from the previous step to the edges of the loop (the loop which is drawn by joining red tiles)
function extendRowsAndColumns(coordinates, rowsAndColumns) {
  const { rows, columns } = rowsAndColumns;
  const keysInRows = Object.keys(rows);
  const keysInColumns = Object.keys(columns);

  const extendedRows = {};
  const extendedColumns = {};
  keysInRows.forEach((r) => (extendedRows[r] = [...rows[r]]));
  keysInColumns.forEach((c) => (extendedColumns[c] = [...columns[c]]));
  // console.log({extendedColumns, extendedRows});

  // 1. follow the loop by joining every coordinate with the next one (and the last coordinate with the first one)
  for (let i = 0; i < coordinates.length; i++) {
    const current = coordinates[i];
    let next;
    if (i === coordinates.length - 1) {
      next = coordinates[0];
    } else {
      next = coordinates[i + 1];
    }
    // console.log('Joining: ', {current, next});

    const [x1, y1] = current;
    const [x2, y2] = next;

    // 2. now we extend the joining line within the bounds of the loop.

    /*  We will use these joining lines to check if they contain the sides of the area rectangles.

    ..#-#    ..#.#
    ..|.|    ..|.|
    #-#.| => #-#-|
    |...|    |.|.|
    #---#    #---#
    */

    // if y coordinates (row) are the same (line is drawn horizontally),
    if (y1 === y2) {
      const newCurrentRowRange = recalculateRange(
        [x1, x2],
        y1,
        keysInColumns,
        columns
      );

      if (newCurrentRowRange) {
        extendedRows[y1] = newCurrentRowRange;
      }
    }

    // if x coordinates (column) are the same (line is drawn vertically),
    if (x1 === x2) {
      const newCurrentColRange = recalculateRange(
        [y1, y2],
        x1,
        keysInRows,
        rows
      );

      if (newCurrentColRange) {
        extendedColumns[x1] = newCurrentColRange;
      }
    }
  }
  // 3. return extended rows and extended columns
  return { extendedRows, extendedColumns };
}

function parseCoordinates(input) {
  const parsedCoordinates = input
    .trim()
    .split(/\n/)
    .map((coord) => coord.split(',').map((n) => Number(n)));

  return parsedCoordinates;
}

async function main() {
  try {
    const input = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const parsedCoordinates = parseCoordinates(input);
    // console.log('parsedCoordinates: ', parsedCoordinates);

    const rowsAndColumns = getRowsAndColumns(parsedCoordinates);
    // console.log('rowsAndColumns: ', rowsAndColumns);

    const extendedRowsAndColumns = extendRowsAndColumns(
      parsedCoordinates,
      rowsAndColumns
    );
    // console.log('extendedRowsAndColumns: ', extendedRowsAndColumns);

    const greatestArea = findGreatestArea(
      parsedCoordinates,
      extendedRowsAndColumns
    );
    console.log('greatestArea: ', greatestArea);
  } catch (err) {
    console.error(err);
  }
}

await main();
