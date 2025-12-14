import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-10';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

// function to transform a light scheme by toggling buttons, returns new scheme
function toggleLights(lights, buttons) {
  const lightsArray = lights.split(''); // ['.', '#', '#', '.'];
  buttons.forEach((i) => {
    const char = lightsArray[i];
    if (char === '.') {
      lightsArray[i] = '#';
    } else if (char === '#') {
      lightsArray[i] = '.';
    }
  });
  return lightsArray.join('');
}

// get all combinations of buttons, as an array of sorted by their length combinations
function getButtonCombinations(wiringSchemes) {
  const combinations = [];

  function recursive(curr, remaining) {
    if (remaining.length === 0) {
        if (curr.length > 0) {
            combinations.push(curr);
        }
        return;
    }
    recursive([...curr, remaining[0]], remaining.slice(1));
    recursive(curr, remaining.slice(1));
  }

  recursive([], wiringSchemes);

  // console.log('combinations: ', combinations)
  return combinations.sort((a, b) => a.length - b.length);
}

// returns the minimun number of button combinations activated
// to achieve the target light diagram
function findMinimunNumOfPresses(lightDiagram, wiringSchemes) {
  /*
  lightDiagram: '.##.',
  wiringSchemes: [ [ 3 ], [ 1, 3 ], [ 2 ], [ 2, 3 ], [ 0, 2 ], [ 0, 1 ] ]
  */
  console.log({
    lightDiagram,
    wiringSchemes,
  });

  const buttonCombinations = getButtonCombinations(wiringSchemes);

  let minPresses = Infinity;
  // start with the lights off (e.g. '....')
  const initLightDiagram = lightDiagram.replaceAll('#', '.');

  // loop over every combination of buttons, start from the smallest (combination of one buttons array)
  outer: for (let i = 0; i < buttonCombinations.length; i++) {
    const currentComb = buttonCombinations[i];
    // console.log('Looping combinations with ', currentComb);

    // we exhausted 'smaller' combinations, fewer presses won't be possible anymore
    if (currentComb.length > minPresses) {
      console.log('Current combination is longer than the min number of presses, exiting loops');
      return minPresses;
    }

    let presses = 0; // every combination array sets the counter
    let currentLightDiagram = initLightDiagram;

    inner: for (let k = 0; k < currentComb.length; k++) {
      currentLightDiagram = toggleLights(currentLightDiagram, currentComb[k]);
      // console.log('currentLightDiagram: ', currentLightDiagram);
      presses++;
      if (presses >= minPresses) {
        break;
      }

      if (currentLightDiagram === lightDiagram) {
        console.log('Combination found ', currentComb, ' at ', currentComb[k]);
        if (presses < minPresses) {
          minPresses = presses;
          console.log('New min presses: ', minPresses);
          if (minPresses === 1) {
            break outer;
          } else {
            break inner;
          }
        }
      }
    }
  }
  
  return minPresses;
}

// loops through the diagrams and respective wiring schemes, adds the results
function calculateButtonPresses(instructions) {
  let totalPresses = 0;

  for (let i = 0; i < instructions.length; i++) {
    const { lightDiagram, wiringSchemes } = instructions[i];
    totalPresses += findMinimunNumOfPresses(lightDiagram, wiringSchemes);
  }

  return totalPresses;
}

// parse input into convenient data structures
function processManual(input) {
  const processedData = input
    .trim()
    .split(/\n/)
    .map((instruction) => {
      // "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}"
      const lightDiagram = instruction.match(/[.#]+/)[0];
      const wiringSchemes = instruction
        .match(/(?<=\()[0-9,]+?(?=\))/g)
        .map((seq) => seq.split(',').map((n) => Number(n)));
      const joltageRequirements = instruction
        .match(/(?<=\{)[0-9,]+?(?=\})/)[0]
        .split(',')
        .map((n) => Number(n));

      // return obj with props: lightDiagram (string ".##."), wiringSchemes (array of arrays [[3], [1,3], [2], [2,3], [0,2], [0,1]]), joltageRequirements (array of nums [3,5,4,7])
      return {
        lightDiagram,
        wiringSchemes,
        joltageRequirements,
      };
    });

  return processedData;
}

async function main() {
  try {
    const input = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const instructions = processManual(input);
    // console.log('instructions: ', instructions);

    const result = calculateButtonPresses(instructions);
    console.log('result: ', result);
  } catch (err) {
    console.error(err);
  }
}

await main();
