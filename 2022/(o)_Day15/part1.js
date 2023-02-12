// libraries & modules
const { readFileSync, readdirSync, writeFileSync, mkdirSync } = require('fs');
const { sleep } = require('../../src/utils/misc/sleep');
const { convert } = require('convert');
const { fetchInput } = require('../../src/API/fetchInput');
const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const {
	initializeInputExtractionTools,
} = require('../../src/utils/main/extractInput');
const { initializeTools, tools } = require('../../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	initializeInputExtractionTools();
	const data = await fetchInput();
	//console.time('Execution time');
	await (data instanceof Error ? console.error(data.message) : task(data));
	//console.timeEnd('Execution time');
};
start();

const symbols = {
	/* 	air: ' ',
	sensor: 'S',
	beacon: 'B',
	signal: '#', */
	air: '⬛',
	sensor: '📡',
	beacon: '🚨',
	signal: '💎',
};

async function parseInput(lines) {
	let sensorCoords = [];
	let beaconCoords = [];
	for (let i = 0; i < lines.length; ++i) {
		const cur = String(lines[i]).split(':');
		const sensor = cur[0].split(' ').slice(-2);
		const beacon = cur[1].split(' ').slice(-2);

		sensorCoords.push([
			+sensor[0].replace(/[a-zA-Z]|,|=/g, ''),
			+sensor[1].replace(/[a-zA-Z]|,|=/g, ''),
		]);
		beaconCoords.push([
			+beacon[0].replace(/[a-zA-Z]|,|=/g, ''),
			+beacon[1].replace(/[a-zA-Z]|,|=/g, ''),
		]);
	}
	return [sensorCoords, beaconCoords];
}

async function getMinsMaxes(sensorCoords, beaconCoords) {
	const maxX = sensorCoords
		.concat(beaconCoords)
		.sort((a, b) => b[0] - a[0])[0][0];

	const maxY = sensorCoords
		.concat(beaconCoords)
		.sort((a, b) => b[1] - a[1])[0][1];

	const minX = sensorCoords
		.concat(beaconCoords)
		.sort((a, b) => a[0] - b[0])[0][0];

	const minY = sensorCoords
		.concat(beaconCoords)
		.sort((a, b) => a[1] - b[1])[0][1];

	return [maxX, maxY, Math.abs(minX), Math.abs(minY)];
}

async function generateMatrix(maxX, maxY, minX, minY) {
	return [...Array(maxY + minY + 1)].map((z) =>
		[...Array(maxX + minX + 1)].map((v, i) => symbols.air)
	);
}

async function populateMatrix(matrix, sensorCoords, beaconCoords) {
	sensorCoords.forEach((v) => {
		matrix[v[1]][v[0]] = symbols.sensor;
	});
	beaconCoords.forEach((v) => {
		matrix[v[1]][v[0]] = symbols.beacon;
	});
	return matrix;
}

const checkIfOutOfBounds = async (maxWidth, maxHeight, x, y) =>
	x < 0 || y < 0 || x > maxWidth || y > maxHeight;

const checkForFilledSquare = async (matrix, x, y) =>
	matrix[y][x] !== symbols.air;

async function radiusExpander(matrix, step, x, y, beaconFound) {
	const half = step / 2;
	const maxWidth = matrix[0].length - 1;
	const maxHeight = matrix.length - 1;

	// go from far left to far top
	for (let i = 0; i < half; ++i) {
		const c = {
			x: x - half + i,
			y: y - i,
		};
		if (await checkIfOutOfBounds(maxWidth, maxHeight, c.x, c.y)) continue;
		if (matrix[c.y][c.x] === symbols.beacon) beaconFound = true;
		if (await checkForFilledSquare(matrix, c.x, c.y)) continue;
		matrix[c.y][c.x] = symbols.signal;
	}

	// go from far top to far right
	for (let i = 0; i < half; ++i) {
		const c = {
			x: x + i,
			y: y - half + i,
		};
		if (await checkIfOutOfBounds(maxWidth, maxHeight, c.x, c.y)) continue;
		if (matrix[c.y][c.x] === symbols.beacon) beaconFound = true;
		if (await checkForFilledSquare(matrix, c.x, c.y)) continue;
		matrix[c.y][c.x] = symbols.signal;
	}

	// go from far right to far bottom
	for (let i = 0; i < half; ++i) {
		const c = {
			x: x + half - i,
			y: y + i,
		};
		if (await checkIfOutOfBounds(maxWidth, maxHeight, c.x, c.y)) continue;
		if (matrix[c.y][c.x] === symbols.beacon) beaconFound = true;
		if (await checkForFilledSquare(matrix, c.x, c.y)) continue;
		matrix[c.y][c.x] = symbols.signal;
	}

	// go from far bottom to far left
	for (let i = 0; i < half; ++i) {
		const c = {
			x: x - i,
			y: y + half - i,
		};
		if (await checkIfOutOfBounds(maxWidth, maxHeight, c.x, c.y)) continue;
		if (matrix[c.y][c.x] === symbols.beacon) beaconFound = true;
		if (await checkForFilledSquare(matrix, c.x, c.y)) continue;
		matrix[c.y][c.x] = symbols.signal;
	}

	return [beaconFound, matrix];
}

async function printMatrix(matrix) {
	console.log(`\nSTART`);
	matrix.forEach((v) => {
		console.log(v.join(''));
	});
	console.log(`END\n`);
}

async function countSignalsOnRow(matrix, rowNumber) {
	let count = 0;
	for (let x = 0; x < matrix[0].length; ++x) {
		if (matrix[rowNumber][x] === symbols.signal) count++;
	}
	return count;
}

async function task(input) {
	const lines = await input.splitInputEveryNLines(1);

	let [sensorCoords, beaconCoords] = await parseInput(lines);

	const [maxX, maxY, minX, minY] = await getMinsMaxes(
		sensorCoords,
		beaconCoords
	);

	sensorCoords = sensorCoords.map((v) => [v[0] + minX, v[1] + minY]);
	beaconCoords = beaconCoords.map((v) => [v[0] + minX, v[1] + minY]);

	const generatedMatrix = await generateMatrix(maxX, maxY, minX, minY);

	// final matrix version before while loop
	let matrix = await populateMatrix(
		generatedMatrix,
		sensorCoords,
		beaconCoords
	);

	// for each sensor in the matrix
	for (let i = 0; i < sensorCoords.length; ++i) {
		// get current sensor coordinates
		const [x, y] = sensorCoords[i];
		// variable that stores if beacon has been found or not
		let beaconFound = false;
		// note down by how much the search range expanded (increment after each iteration)
		let step = 0;
		// if beacon is found, break loop (Continue to next set of sensor coordinates)
		while (!beaconFound) {
			// increment step by 2
			step += 2;

			// draw next diamond; update matrix
			[beaconFound, matrix] = await radiusExpander(
				matrix,
				step,
				x,
				y,
				beaconFound
			);
		}
		// print current matrix
		printMatrix(matrix);
	}

	const total = await countSignalsOnRow(matrix, minY + 10);

	console.log(total);
}
