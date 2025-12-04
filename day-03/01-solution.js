import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-03';
const INPUT_FILE = 'input.txt';

async function processBank(bank) {
  // max joltage is defined by the maximum value for tens place + (second) max value for ones place
  let max;
  let secondMax;

  // let's loop through a string of digit characters
  for (let i = 0; i < bank.length; i++) {
    // convert into number
    const numVal = Number(bank[i]);
    // assign initial number value
    if (i === 0) {
      max = numVal;
      secondMax = Number(bank[i + 1]);
    // second to last number is the last potential candidate for the max number
    } else if (i === bank.length - 1) {
      if (numVal > secondMax) {
        secondMax = numVal;
      }
    // compare to max and secondMax
    } else {
      if (numVal > max) {
        max = numVal;
        secondMax = Number(bank[i + 1]);
      } else if (numVal > secondMax) {
          secondMax = numVal;
      }
    }
  }
  const maxJoltage = max * 10 + secondMax;
  // console.log({ bank, maxJoltage });
  return maxJoltage;
}

async function main() {
  try {
    const filePath = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    let linesCount = 0;
    let totalJoltageOutput = 0;

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      linesCount++;
      const maxJoltage = await processBank(trimmed);
      totalJoltageOutput += maxJoltage;
    }

    rl.close();
    console.log({ linesCount, totalJoltageOutput });
  } catch (err) {
    console.error(err);
  }
}

await main();
