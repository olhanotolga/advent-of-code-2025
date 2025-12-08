import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-06';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function calculateSumOfOperations(numbers, operators) {
  let totalSum = 0;
  let operator;
  let result;

  for (let i = 0; i < operators.length; i++) {
    operator = operators[i]; // "+" or "*"
    result = operator === '+' ? 0 : 1;

    for (let n = 0; n < numbers.length; n++) {
      operator === '+' ? (result += numbers[n][i]) : (result *= numbers[n][i]);
    }

    totalSum += result;
    // console.log({ result, totalSum });
  }

  return totalSum;
}

function processData(data) {
  const processedData = data.split(/\n/);
  const length = processedData.length;
  const numbers = processedData.slice(0, length - 1).map((row) =>
    row
      .split(/\s+/)
      .filter((num) => num.length)
      .map((num) => Number(num))
  );
  const operators = processedData[length - 1]
    .split(/\s+/)
    .filter((operator) => operator.length);

  if (!numbers.every((row) => row.length === operators.length)) {
    throw new Error(
      "Number of operands doesn't match the number of operators!"
    );
  }

  // console.log({ numbers, operators });
  return { numbers, operators };
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const { numbers, operators } = processData(data);

    const sumOfOperations = calculateSumOfOperations(numbers, operators);

    console.log(sumOfOperations);
  } catch (err) {
    console.error(err);
  }
}

await main();
