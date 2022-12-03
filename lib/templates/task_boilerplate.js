// libraries & modules
const fs = require('fs');
const { join } = require('path');
const { fetchInput } = require(join(__dirname, '/src/API/fetchInput'));
const { extractInput } = require(join(__dirname, '/src/utils/extractInput'));

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
	let extractedInput = await extractInput(rawInput, 1);
	console.log(extractedInput);

	part2(input, arr);
}

// * PART #2
async function part2(input, arr) {}
