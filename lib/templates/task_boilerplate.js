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

// * PART #1
async function part1(input) {
	console.log(input);

	// split input every "n" lines.
	const split = await input.splitInputEveryNLines(3);
	console.log('SplitEveryNLines: ', split);

	// split input at every blank line
	const splitBlank = await input.splitInputEveryBlankLine();
	console.log('SplitEveryBlankLine: ', splitBlank);

	// * Write code here:
	for (let i = 0; i < split.length; ++i) {}

	part2(input);
}

// * PART #2
async function part2(input) {}
