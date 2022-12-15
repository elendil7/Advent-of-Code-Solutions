// libraries & modules
const fs = require('fs');
const { sleep } = require('../../src/utils/misc/sleep');
const { convert } = require('convert');
const { fetchInput } = require('../../src/API/fetchInput');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const {
	initializeInputExtractionTools,
} = require('../../src/utils/main/extractInput');
const { initializeTools, tools } = require('../../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	initializeInputExtractionTools();
	const data = await fetchInput(14, 2022);
	console.time('Execution time');
	await (data instanceof Error ? console.error(data.message) : task(data));
	console.timeEnd('Execution time');
};
start();

// store symbols for later usage
const symbols = {
	air: '🟦',
	rock: '🧱',
	sand: '🏖️',
	plus: '➕',
};

async function getCoordinates(lines, coordinates) {
	// loop through N lines of instructions (first time), and store every coordinate possible
	for (let i = 0; i < lines.length; i++) {
		const coords = String(lines[i])
			.removeWhitespace()
			.split('->')
			.map((v) => v.split(','));

		for (let j = 0; j < coords.length; j++) {
			const [y, x] = coords[j];
			// store in map of coords
			coordinates[y] = x;
		}
	}
	return coordinates;
}

async function generateCave(maxX, maxY) {
	// construct cave using sizes derived above
	return [...Array(maxY + 3)].map((v) =>
		[...Array(maxX + 6)].map((v) => symbols.air)
	);
}

async function constructCave(lines, unfinishedCave) {
	// loop through N lines of instructions again
	for (let i = 0; i < lines.length; i++) {
		// get current coords (instructions)
		const coords = String(lines[i])
			.removeWhitespace()
			.split('->')
			.map((v) => v.split(','));

		// populate grid with rock paths using coordinates derived from previous step
		for (let j = 0; j < coords.length - 1; j++) {
			const [old_x, old_y] = coords[j];
			const [cur_x, cur_y] = coords[j + 1];
			const x = Math.min(cur_x, old_x);
			const y = Math.min(cur_y, old_y);

			if (old_y === cur_y) {
				for (let steps = 0; steps <= Math.abs(old_x - cur_x); ++steps) {
					unfinishedCave[y][x + steps] = symbols.rock;
				}
			} else if (old_x === cur_x) {
				for (let steps = 0; steps <= Math.abs(old_y - cur_y); ++steps) {
					unfinishedCave[y + steps][x] = symbols.rock;
				}
			}
		}
	}
	return unfinishedCave;
}

async function checkBelow(cave, c) {
	return cave[c.y + 1][c.x] === symbols.air;
}

async function checkDownLeft(cave, c) {
	return cave[c.y + 1][c.x - 1] === symbols.air;
}

async function checkDownRight(cave, c) {
	return cave[c.y + 1][c.x + 1] === symbols.air;
}

async function nextSandFalls(cave) {
	// define variable for storing current coordinate (x, y)
	let c = {
		x: 500,
		y: 0,
	};

	// go down from x = 500, y = 0
	for (let x = 0; x < cave.length - 1; ++x) {
		// if tile below is unblocked, keep falling
		if (await checkBelow(cave, c)) {
		}
		// if tile below is blocked
		else if (!(await checkBelow(cave, c))) {
			// if tile to the down-left is unblocked
			if (await checkDownLeft(cave, c)) {
				c.x--;
				// if tile to the down-right is unblocked
			} else if (await checkDownRight(cave, c)) {
				c.x++;
				// if all tiles are blocked (return coordinates)
			} else {
				return c;
			}
		}
		// always increment y value by 1 (sand must keep falling, condtions above remain in effect)
		c.y++;
	}

	// return null if sand ended up in the void
	return null;
}

// only prints within the cave bounds (limits)
const printCave = async (cave, minY, maxY, minX, maxX) => {
	console.log('\nCAVE: ');
	cave.slice(0, maxY + 1).forEach((line) => {
		console.log(line.slice(minX, maxX + 1).join(''));
	});
	console.log(`END\n`);
};

async function task(input) {
	// get input
	const lines = await input.splitInputEveryNLines(1);

	// get coordinates
	const coordinates = await getCoordinates(lines, {});

	// get min & max of X & Y coordinates. Also get caveWidth & caveHeight for later
	const coordsX = coordinates.sortByKeys();
	const coordsY = coordinates.sortByValues();
	const minX = +coordsX[0],
		maxX = +coordsX.at(-1),
		minY = +coordsY[0],
		maxY = +coordsY.at(-1);

	// generate unfinished cave
	const unfinishedCave = await generateCave(maxX, maxY);

	// construct cave walls
	const cave = await constructCave(lines, unfinishedCave);

	// define source of sand as "+"
	cave[0][500] = symbols.plus;

	// log total sand fallen
	let totalFallenSand = 0;
	// keeps looping indefinitely until internal condition met
	while (true) {
		// get the next coordinate that the sand has fallen to (simulate falling sand)
		const c = await nextSandFalls(cave);
		// if current coord is null (sand ended up in void), break out of loop
		if (!c) break;
		// set sand at designated position in cave
		cave[c.y][c.x] = symbols.sand;
		// increase total fallen sand so far
		totalFallenSand++;
		// print cave for vanity purposes
		/* 		console.clear();
		await printCave(cave, minY, maxY, minX, maxX);
		await sleep(100); */
	}

	printCave(cave, minY, maxY, minX, maxX);

	// log and return total fallen sand
	console.log(totalFallenSand);
	return totalFallenSand;
}
