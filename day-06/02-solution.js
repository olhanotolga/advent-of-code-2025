import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-06';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function initOperation() {
  return {
    numbers: [],
    operator: '',
  };
}

function processOperation(numbers, operator) {
  let result;
  switch (operator) {
    case '*': {
      result = numbers.reduce((acc, cur) => acc * cur, 1);
      // console.log({
      //   operator,
      //   numbers,
      //   result,
      // });
      return result;
    }
    case '+': {
      result = numbers.reduce((acc, cur) => acc + cur, 0);
      // console.log({
      //   operator,
      //   numbers,
      //   result,
      // });
      return result;
    }
    default: {
      throw new Error('Unrecognized operator: ', operator);
    }
  }
}

function calculateSumOfOperations(dataRows) {
  const totalColumns = dataRows[0].length;
  const totalRows = dataRows.length;

  let totalSum = 0;

  const lastColumnId = totalColumns - 1;
  const lastRowId = totalRows - 1;

  // loop from right to left, ci will refer to columns

  // we will parse each math operation.
  // its data will be stored in an object with two props: numbers array and operator.
  // this var will be updated after every empty column (operations separator).
  let operation = initOperation();
  for (let ci = lastColumnId; ci >= 0; ci--) {
    let number = '';
    // now iterate top to bottom, row by row
    for (let ri = 0; ri < totalRows; ri++) {
      const currentChar = dataRows[ri][ci];
      // last row can only contain an operator or be empty
      if (ri === lastRowId) {
        // console.log('number at the end of the column: ', {number});

        // this is where we check if the column was empty or not.
        // if yes, then it was a column break, we process current operation and start the next one:
        if (number === '') {
          totalSum += processOperation(operation.numbers, operation.operator);
          operation = initOperation();
          continue;
        }

        if (currentChar === '*' || currentChar === '+') {
          operation.operator = currentChar;
        }
        // on the last row, we can combine the characters into a number and push it into operation.number
        operation.numbers.push(Number(number));
        number = '';

        // not to forget to increment the total sum on the final iteration:
        if (ci === 0) {
          totalSum += processOperation(operation.numbers, operation.operator);
        }
      } else {
        // concat character with number
        const char = currentChar === ' ' ? '' : currentChar;
        number = number + char;
      }
    }
  }

  return totalSum;
}

function processData(data) {
  return data.split(/\n/);
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const dataByRows = processData(data);
    // console.log({ dataByRows });

    const sumOfOperations = calculateSumOfOperations(dataByRows);
    console.log(sumOfOperations);
  } catch (err) {
    console.error(err);
  }
}

await main();
