import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const CURRENT_DIR = 'day-08';
const INPUT_FILE = 'input.txt';
const FILE_PATH = path.join(process.cwd(), CURRENT_DIR, INPUT_FILE);

function getXMultiple(jB1, jB2) {
  const x1 = jB1.split(',')?.[0];
  const x2 = jB2.split(',')?.[0];

  return Number(x1) * Number(x2);
}

function mergeCircuits(indices, circuits) {
  // concatenate circuits, leave only unique coordinates
  const merged = circuits[indices[0]].concat(circuits[indices[1]]);
  const mergedUnique = Array.from(new Set(merged));
  // replace two overlapping circuits with one
  const newCircuits = circuits.filter((_, index) => !indices.includes(index));
  newCircuits.push(mergedUnique);
  return newCircuits;
}

function groupCircuits(distances, numOfBoxes) {
  // array of circuits, each circuit is an array of coordinates (as string)
  let circuits = [];

  for (let i = 0; i < distances.length; i++) {
    const { a, b } = distances[i];
    // console.log('---------')
    // console.log('distance:', distances[i]);
    // console.log('circuits:', circuits);

    // push the first pair of coordinates as its own circuit
    if (!circuits.length) {
      // console.log('Initializing the circuits array...');
      circuits.push([a, b]);
      continue;
    }

    let inCircuits = false;
    let circuitIndicesUpdated = [];

    for (let c = 0; c < circuits.length; c++) {
      const currentCircuit = circuits[c];
      const aInCircuit = currentCircuit.includes(a);
      const bInCircuit = currentCircuit.includes(b);

      // if both are from the pair are in the circuit, skip
      if (aInCircuit && bInCircuit) {
        inCircuits = true;
        break;
      }

      // if any of the pair, push the other one there too
      if (aInCircuit || bInCircuit) {
        aInCircuit && currentCircuit.push(b);
        bInCircuit && currentCircuit.push(a);
        inCircuits = true;
        // track which circuit indices were updated.
        circuitIndicesUpdated.push(c);
      }

      // the pair has already found its circuit(s): break
      if (circuitIndicesUpdated.length === 2) {
        break;
      }
    }

    // if no fitting circuit was found, push both coordinates as new array to circuits
    !inCircuits && !circuitIndicesUpdated.length && circuits.push([a, b]);

    // merging circuits if more than 1 existing circuit was updated
    if (circuitIndicesUpdated.length === 2) {
      circuits = mergeCircuits(circuitIndicesUpdated, circuits);
    }

    // sort circuits after each iteration
    circuits = circuits.sort((a, b) => b.length - a.length);

    // when the largest circuit contains all the junction boxes, return result
    if (circuits[0].length === numOfBoxes) {
      console.log(
        `All junction boxes are in the same circuit!!! The last boxes to connect were: ${a} and ${b}`
      );

      return getXMultiple(a, b);
    }
  }

  return null;
}

function calculateDistance(xyz1, xyz2) {
  return Math.round(
    Math.sqrt(
      (xyz1[0] - xyz2[0]) ** 2 +
        (xyz1[1] - xyz2[1]) ** 2 +
        (xyz1[2] - xyz2[2]) ** 2
    )
  );
}

function getDistances(coords) {
  const distances = [];
  // comparing each box against each box, ensuring unique pairs
  // last one will have already been compared to every box before its turn
  for (let i = 0; i < coords.length - 1; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const distance = calculateDistance(coords[i], coords[j]);
      distances.push({
        a: `${coords[i]}`,
        b: `${coords[j]}`,
        distance: distance,
      });
    }
  }
  return distances.sort((a, b) => a.distance - b.distance);
}

function processData(data) {
  return data.split(/\n/).map((row) => row.split(',').map((n) => Number(n)));
}

async function main() {
  try {
    const data = await fs.readFile(FILE_PATH, { encoding: 'utf8' });

    const processedData = processData(data);
    // console.log('processedData:', processedData);

    const distances = getDistances(processedData);
    // console.log('distances:', distances);

    const result = groupCircuits(distances, processedData.length);
    console.log({ result });
  } catch (err) {
    console.error(err);
  }
}

await main();
