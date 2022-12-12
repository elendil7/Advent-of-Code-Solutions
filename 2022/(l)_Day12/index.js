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
	return data instanceof Error
		? console.error(data.message)
		: await part1(data) /* , await part2(data) */;
};
start();

// * ATTEMPT #1
// template for each node: [x, y, letter, height]

const getCharCode = async (c) => {
	return c.charCodeAt(0) - 97;
};

const scaleCoordinates = async (x, y) => {
	return x * 1e3 + y;
};
const unscaleCoordinates = async (val) => {
	return [Math.floor(val / 1e3), val % 1e3];
};

const getNeighbours = async (graph, curPos, rowsLength, colsLength) => {
	const [x, y] = await unscaleCoordinates(curPos);
	console.log(x, y);

	let neighbours = [];
	let letter = undefined;

	// up
	if (x > 0) {
		letter = graph[x - 1][y];
		neighbours.push([x - 1, y, letter, await getCharCode(letter)]);
	}
	//down
	if (x < rowsLength - 1) {
		letter = graph[x + 1][y];
		neighbours.push([x + 1, y, letter, await getCharCode(letter)]);
	}
	//left
	if (y > 0) {
		letter = graph[x][y - 1];
		neighbours.push([x, y - 1, letter, await getCharCode(letter)]);
	}
	//right
	if (y < colsLength - 1) {
		letter = graph[x][y + 1];
		neighbours.push([x, y + 1, letter, await getCharCode(letter)]);
	}

	if (letter)
		return neighbours.filter((v) => getCharCode(graph[x][y]) + 1 >= v[3]);
};

async function Dijkstra(graph, source, destination, rowsLength, colsLength) {
	const dist = {};
	const prev = {};
	let Q = [];

	for (let x = 0; x < rowsLength; ++x) {
		for (let y = 0; y < colsLength; ++y) {
			const v = await scaleCoordinates(x, y);
			dist[v] = Infinity;
			prev[v] = Infinity;
			Q.push(v);
		}
	}

	dist[await scaleCoordinates(source[0], source[1])] = 0;

	while (Q.isArrayNotEmpty()) {
		let u = null;
		for (let i = 0; i < Q.sortLowToHigh().length; ++i) {
			if (u === null || dist[Q[i]] < dist[u]) {
				u = Q[i];
			}
		}
		if (u === (await scaleCoordinates(destination[0], destination[1]))) {
			break;
		}

		Q = Q.filter((v) => v !== u);

		const neighbours = await getNeighbours(
			graph,
			u,
			rowsLength,
			colsLength
		);
		for (let i = 0; i < neighbours.length; ++i) {
			const alt = dist[u] + 1;
			const cur = neighbours[i];
			const v = await scaleCoordinates(cur[0], cur[1]);
			if (alt < dist[v]) {
				dist[v] = alt;
				prev[v] = u;
			}
		}
	}

	return { dist, prev };
}

// * PART #1
async function part1(input) {
	let lines = await input.splitInputEveryNLines(1);
	lines = lines.map((v) => String(v).split(''));

	const rowsLength = lines.length;
	const colsLength = lines[0].length;
	let startPos, endPos;

	for (let x = 0; x < rowsLength; ++x) {
		for (let y = 0; y < colsLength; ++y) {
			const curPos = lines[x][y];
			if (curPos === 'S') startPos = [x, y, 'a', await getCharCode('a')];
			if (curPos === 'E') endPos = [x, y, 'z', await getCharCode('z')];
		}
	}

	console.log(lines);
	console.log(startPos, endPos);

	let data = await Dijkstra(lines, startPos, endPos, rowsLength, colsLength);

	console.log(data.dist);
	console.log(data.dist[scaleCoordinates(endPos[0], endPos[1])]);
}

// * PART #2
async function part2(input) {}
