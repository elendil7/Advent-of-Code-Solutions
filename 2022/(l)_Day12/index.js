// libraries & modules
const fs = require('fs');
const { sleep } = require('../../src/utils/misc/sleep');
const { convert } = require('convert');
const { fetchInput } = require('../../src/API/fetchInput');
const {
	initializeInputExtractionTools,
} = require('../../src/utils/main/extractInput');
const { initializeTools, tools } = require('../../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	initializeInputExtractionTools();
	const data = await fetchInput();
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1
async function generateNumberFromCoords(row, col) {
	return String((3 + row) * (3 + col));
}

let elevations = 'abcdefghijklmnopqrstuvwxyz';

async function getPotentialDirections(rowLength, colLength, row, col, height) {
	// get (letter, coord, elevationLetter, height) of coordinates (above, below, to left and right) of current coordinate.
	let init = [];

	if (row > 0) {
		init.push(await generateNumberFromCoords(row - 1, col));
	}
	if (row < rowLength - 1) {
		init.push(await generateNumberFromCoords(row + 1, col));
	}
	if (col > 0) {
		init.push(await generateNumberFromCoords(row, col - 1));
	}
	if (col < colLength - 1) {
		init.push(await generateNumberFromCoords(row, col + 1));
	}

	// store potential directions in array. Filter to remove null values, and remove elevations of height > 1 of current height.
	init = [up, down, left, right].filter(
		(v) => height + 1 >= elevations.indexOf(v[2])
	);

	return init;
}

// * PART #1
async function part1(input) {
	let lines = await input.splitInputEveryNLines(1);
	lines = lines.map((v) => String(v).split(''));
	console.log(lines);

	// get basic info, store in variables
	let startPos = [],
		endPos = [];
	const rowLength = lines.length;
	const colLength = lines[0].length;

	// * Dijkstra's_algorithm
	// define following data structures:
	// distances
	const dist = {};
	// previous nodes (already visited locations)
	const prev = {};
	// define heap
	const heap = [];
	// define heap and add starting point to it (fields: totalCost, row (x), col (y), elevationLetter, height)
	//let heap = [[0, startPos[1], startPos[2], 0, 'a']];

	// get S & E positions in 2D array, and populate data structures above
	// for rows
	for (let row = 0; row < lines.length; row++) {
		// for columns
		for (let col = 0; col < lines[row].length; col++) {
			const cur = lines[row][col];
			if (cur === 'S') startPos.push('S', row, col);
			if (cur === 'E') endPos.push('E', row, col);
			const id = await generateNumberFromCoords(row, col);
			dist[id] = Infinity;
			prev[id] = false;
			heap.push(id);
		}
	}

	console.log(dist, prev, heap);

	// set starting point in dist to 0
	dist[await generateNumberFromCoords(startPos[0], startPos[1])] = 0;

	while (heap.isArrayNotEmpty()) {
		// get min
		let min = null;
		for (let i = 0; i < heap.length; i++) {
			const cur = heap[i];
			if (min === null || dist[cur] < dist[min]) {
				min = cur;
			}
		}

		console.log(heap);

		const [steps, row, col, height, letter] = heap.shift();

		// if already visited, skip current iteration of loop
		if (prev[await generateNumberFromCoords(row, col)]) continue;
		// otherwise set to true (to show that already has been visited)
		prev[await generateNumberFromCoords(row, col)] = true;

		// get potential directions (look for next nodes to pathfind to)
		const potentialDirections = await getPotentialDirections(
			rowLength,
			colLength,
			row,
			col,
			height
		);

		console.log(potentialDirections);

		// push each node to heap (Q)
		for (let i = 0; i < potentialDirections.length; i++) {
			heap.push([
				steps + 1,
				potentialDirections[i][0],
				potentialDirections[i][1],
				potentialDirections[i][2],
				potentialDirections[i][3],
			]);
		}
	}

	part2(input);
}

// * PART #2
async function part2(input) {}
