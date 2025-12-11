import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-11';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

const START = 'you';
const END = 'out';

function findPaths(devicesWithOutputs) {
  let numOfPaths = 0;

  function followPath(start) {
    const outputs = devicesWithOutputs[start];

    for (let i = 0; i < outputs.length; i++) {
      const current = outputs[i];
      if (current === END) {
        numOfPaths++;
      } else if (current === START) {
        continue;
      } else {
        followPath(current);
      }
    }
  }

  followPath(START);

  return numOfPaths;
}

function processDeviceOutputs(data) {
  const processedDeviceOutputs = {};
  data
    .trim()
    .split(/\n/)
    .forEach((row) => {
      const [device, outputs] = row.split(': ');
      processedDeviceOutputs[device] = outputs.trim().split(' ');
    });
  return processedDeviceOutputs;
}

async function main() {
  try {
    const input = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const processedDeviceOutputs = processDeviceOutputs(input);
    console.log('processedDeviceOutputs: ', processedDeviceOutputs);

    const result = findPaths(processedDeviceOutputs);
    console.log({ result });
  } catch (err) {
    console.error(err);
  }
}

await main();
