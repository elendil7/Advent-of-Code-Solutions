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
	return data instanceof Error ? console.error(data.message) : task(data);
};
start();

async function getCoordinates(lines, coordinates) {
	for (let i = 0; i < lines.length; i++) {
		const coords = String(lines[i])
			.removeWhitespace()
			.split('->')
			.map((v) => v.split(','));

		for (let j = 0; j < coords.length; j++) {
			const [y, x] = coords[j];
			coordinates[y] = x;
		}
	}
	return coordinates;
}

async function generateCave(maxX, maxY) {
	return [...Array(maxY + 3)].map((v) =>
		[...Array(maxX + 600)].map((v) => '.')
	);
}

async function constructCave(lines, unfinishedCave) {
	for (let i = 0; i < lines.length; i++) {
		const coords = String(lines[i])
			.removeWhitespace()
			.split('->')
			.map((v) => v.split(','));

		for (let j = 0; j < coords.length - 1; j++) {
			const [old_x, old_y] = coords[j];
			const [cur_x, cur_y] = coords[j + 1];
			const x = Math.min(cur_x, old_x);
			const y = Math.min(cur_y, old_y);

			if (old_y === cur_y) {
				for (let steps = 0; steps <= Math.abs(old_x - cur_x); ++steps) {
					unfinishedCave[y][x + steps] = '#';
				}
			} else if (old_x === cur_x) {
				for (let steps = 0; steps <= Math.abs(old_y - cur_y); ++steps) {
					unfinishedCave[y + steps][x] = '#';
				}
			}
		}
	}
	return unfinishedCave;
}

async function manifestFloor(cave) {
	const y = cave.length - 1;
	for (let steps = 0; steps < cave[0].length; ++steps) {
		cave[y][steps] = symbols.rock;
	}
	return cave;
}

const symbols = {
	air: '.',
	rock: '#',
	sand: 'O',
};

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
	let c = {
		x: 500,
		y: 0,
	};

	for (let x = 0; x < cave.length - 1; ++x) {
		if (await checkBelow(cave, c)) {
		} else if (!(await checkBelow(cave, c))) {
			if (await checkDownLeft(cave, c)) {
				c.x--;
			} else if (await checkDownRight(cave, c)) {
				c.x++;
			} else {
				return c;
			}
		}
		c.y++;
	}

	return null;
}

const printCave = (cave, minY, maxY, minX, maxX) => {
	console.log('\nCAVE: ');
	cave.slice(0, maxY + 11).forEach((line) => {
		console.log(line.slice(minX - 100, maxX + 101).join(''));
	});
	console.log(`END\n`);
};

async function task(input) {
	const lines = await input.splitInputEveryNLines(1);

	const coordinates = await getCoordinates(lines, {});

	const coordsX = coordinates.sortByKeys();
	const coordsY = coordinates.sortByValues();
	const minX = +coordsX[0],
		maxX = +coordsX.at(-1),
		minY = +coordsY[0],
		maxY = +coordsY.at(-1);

	const unfinishedCave = await generateCave(maxX, maxY);

	const constructedCave = await constructCave(lines, unfinishedCave);

	const cave = await manifestFloor(constructedCave);

	cave[0][500] = '+';

	let totalFallenSand = 0;
	while (cave[0][500] !== 'O') {
		const c = await nextSandFalls(cave);
		cave[c.y][c.x] = symbols.sand;
		totalFallenSand++;
	}

	printCave(cave, minY, maxY, minX, maxX);

	// log and return total fallen sand
	console.log(totalFallenSand);
	return totalFallenSand;
}
