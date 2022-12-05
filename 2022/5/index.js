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

// * ATTEMPT #1 (26 minutes to complete both parts!)

// * PART #1
async function part1(input) {
	// console.log(input);

	const split = await input.splitInputEveryBlankLine()[1];

	// console.log(split);
	// console.log(split[split.length - 1]);

	// * Write code here:

	let key = {
		1: ['F', 'G', 'V', 'R', 'J', 'L', 'D'],
		2: ['S', 'J', 'H', 'V', 'B', 'M', 'P', 'T'],
		3: ['C', 'P', 'G', 'D', 'F', 'M', 'H', 'V'],
		4: ['Q', 'G', 'N', 'P', 'D', 'M'],
		5: ['F', 'N', 'H', 'L', 'J'],
		6: ['Z', 'T', 'G', 'D', 'Q', 'V', 'F', 'N'],
		7: ['L', 'B', 'D', 'F'],
		8: ['N', 'D', 'V', 'S', 'B', 'J', 'M'],
		9: ['D', 'L', 'G'],
	};

	for (let i = 0; i < split.length; ++i) {
		const cur = String(split[i]).split(' ');
		const howManyCrates = cur[1];
		const from = cur[3];
		const to = cur[5];

		for (let x = 0; x < howManyCrates; ++x) {
			key[to].unshift(key[from].shift());
		}

		// console.log(cur);
	}

	let res = '';

	for (let v in key) {
		res += key[v][0];
	}

	console.log(res);

	part2(input, split);
}

// * PART #2
async function part2(input, split) {
	let key = {
		1: ['F', 'G', 'V', 'R', 'J', 'L', 'D'],
		2: ['S', 'J', 'H', 'V', 'B', 'M', 'P', 'T'],
		3: ['C', 'P', 'G', 'D', 'F', 'M', 'H', 'V'],
		4: ['Q', 'G', 'N', 'P', 'D', 'M'],
		5: ['F', 'N', 'H', 'L', 'J'],
		6: ['Z', 'T', 'G', 'D', 'Q', 'V', 'F', 'N'],
		7: ['L', 'B', 'D', 'F'],
		8: ['N', 'D', 'V', 'S', 'B', 'J', 'M'],
		9: ['D', 'L', 'G'],
	};

	for (let i = 0; i < split.length; ++i) {
		const cur = String(split[i]).split(' ');
		const howManyCrates = cur[1];
		const from = cur[3];
		const to = cur[5];

		key[to] = key[from].slice(0, howManyCrates).concat(key[to]);
		key[from] = key[from].slice(howManyCrates);

		//console.log(cur);
		//console.log(key);
	}

	let res = '';

	//console.log(key);

	for (let v in key) {
		res += key[v][0];
	}

	console.log(res);
}
