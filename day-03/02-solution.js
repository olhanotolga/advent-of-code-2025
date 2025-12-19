import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-03';
const INPUT_FILE = 'input.txt';

const NUM_OF_BATTERIES = 12;

function processBank(bank) {
  let currentBank = bank.split('').map(d => Number(d));
  // console.log('current bank: ', currentBank);

  // max joltage is defined by sum of 12 digits in a bank that compose the largest number (they should come in the order in which they are in the bank)
  const selectedBatteries = [];

  // pick the highest digit from the first batteries in the bank, excluding the last 11 (or so that the total is 12):
  // for this I am creating 'chunks'
  let start = 0;
  let batteriesExcluded = NUM_OF_BATTERIES - 1;
  let end = currentBank.length - batteriesExcluded;
  let chunk = currentBank.slice(start, end);

  // console.log({currentBank, start, batteriesExcluded, end, chunk});

  while ((selectedBatteries.length) < NUM_OF_BATTERIES) {
    // console.log({currentBank, start, end, chunk, selectedBatteries, batteriesExcluded});

    const sortedChunk = chunk.sort((a, b) => b - a);
    const maxDigit = sortedChunk[0];
    // first instance of the highest-joltage battery found in the current slice of the bank
    const index = currentBank.indexOf(maxDigit);

    selectedBatteries.push(maxDigit);
    
    start = index + 1;
    --batteriesExcluded;
    currentBank = currentBank.slice(start);
    end = currentBank.length - batteriesExcluded;
    chunk = currentBank.slice(0, end);
  }
  
  const maxJoltageBatteries = Number(selectedBatteries.join(''));
  // console.log({maxJoltageBatteries});
  return maxJoltageBatteries;
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
      
      const maxJoltage = processBank(trimmed);
      totalJoltageOutput += maxJoltage;
    }

    rl.close();
    console.log({
      linesCount,
      totalJoltageOutput
    });
  } catch (err) {
    console.error(err);
  }
}

await main();
