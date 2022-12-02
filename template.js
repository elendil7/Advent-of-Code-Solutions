const fs = require('fs');
const { join } = require('path');
const { getInput } = require(join(__dirname, `../main.js`));

const start = async () => {
	const input = await getInput();
	// console.log(input);
	part1(input, (arr = []));
};

start();

// * PART 1
async function part1(input, arr) {
	part2(input, arr);
}

// * PART 2
async function part2(input, arr) {}
