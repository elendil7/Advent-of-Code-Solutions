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
	const data = await fetchInput(1, 2015);
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1

// * PART #1
async function part1(input) {
	// console.log(input);

	const floorSantaIsOn =
		[...input].filter((x) => x == '(').length -
		[...input].filter((x) => x == ')').length;

	console.log(`Santa is on floor ${floorSantaIsOn}!`);

	part2(input);
}

// * PART #2
async function part2(input) {
	let index = 0;
	let floor = 0;

	while (floor >= 0 && index < input.length) {
		if (input[index] == '(') floor++;
		else floor--;
		index++;
	}

	console.log(
		`Santa entered the basement at position ${index} of the input!`
	);
}
