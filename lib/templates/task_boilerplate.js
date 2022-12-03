// libraries & modules
const fs = require('fs');
const { fetchInput } = require('../../src/API/fetchInput');
const {
	splitInputEveryNLines,
	splitInputEveryBlankLine,
} = require('../../src/utils/main/extractInput');

const start = async () => {
	const rawInput = await fetchInput();
	part1(rawInput, (arr = []));
};
start();

// * ATTEMPT #1

// * PART #1
async function part1(input, arr) {
	console.log(input);

	// split input every "n" lines.
	const split = await splitInputEveryNLines(input, 3);
	console.log('SplitEveryNLines: ', split);

	// split input at every blank line
	const splitBlank = await splitInputEveryBlankLine(input);
	console.log('SplitEveryBlankLine: ', splitBlank);

	// * Write code here:

	part2(input, arr);
}

// * PART #2
async function part2(input, arr) {}
