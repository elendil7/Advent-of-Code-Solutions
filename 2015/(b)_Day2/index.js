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
	const data = await fetchInput(2, 2015);
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1

// * PART #1
async function part1(input) {
	// formula: 2*l*w + 2*w*h + 2*h*l

	const lines = await input.splitInputEveryNLines(1);

	let totalWrappingPaperSquareFeet = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i][0];
		const [l, w, h] = line.split('x').map((v) => +v);

		const lw = l * w;
		const wh = w * h;
		const hl = h * l;
		const cuboidArea = 2 * (lw + wh + hl);

		totalWrappingPaperSquareFeet += cuboidArea + Math.min(lw, wh, hl);
	}

	console.log(
		`Total wrapping paper square feet: ${totalWrappingPaperSquareFeet}`
	);

	part2(input);
}

// * PART #2
async function part2(input) {
	const lines = await input.splitInputEveryNLines(1);

	let totalRibbonPaperSquareFeet = 0;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i][0];
		const [l, w, h] = line.split('x').map((v) => +v);

		console.log(l, w, h);

		const twoSmallestSides = [l, w, h].sort((a, b) => a - b).slice(0, 2);
		const perimeterOfSmallestSides =
			twoSmallestSides[0] * 2 + twoSmallestSides[1] * 2;

		totalRibbonPaperSquareFeet += perimeterOfSmallestSides + l * w * h;
	}

	console.log(totalRibbonPaperSquareFeet);
}
