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
	const data = await fetchInput(6, 2022);
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1

// * PART #1 (time: 13:09 minutes)
async function part1(input) {
	// console.log(input);

	let res;

	// * Write code here:
	for (let i = 4; i < input.length - 4; ++i) {
		const cur = input.slice(i - 4, i);

		// console.log(cur, [...new Set(cur.split(''))].join('').length);

		if (cur.removeDuplicates().length == 4) {
			res = i;
			break;
		}
	}

	console.log(res);

	part2(input);
}

// * PART #2 (time: 1:44 minutes)
async function part2(input) {
	let res;

	// * Write code here:
	for (let i = 14; i < input.length; ++i) {
		const cur = input.slice(i - 14, i);

		if (cur.removeDuplicates().length == 14) {
			res = i;
			break;
		}
	}

	console.log(res);
}
