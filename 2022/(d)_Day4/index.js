// libraries & modules
const fs = require('fs');
const { convert } = require('convert');
const { fetchInput } = require('../../src/API/fetchInput');
const {
	initializeInputExtractionTools,
} = require('../../src/utils/main/extractInput');

const { initializeTools, tools } = require('../../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	initializeInputExtractionTools();
	const data = await fetchInput(4, 2022);
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1

// * PART #1 (time: 1 hour 43 minutes) (reason: input parser was BUSTED man, what a shame. All iterations of code are spot on but answer was off by 1 each time.)
async function part1(input) {
	// console.log(input);

	// split input at every blank line
	let splitted = input.split('\n');

	// console.log('SplitEveryBlankLine: ', splitted);

	/* 
		1 section per line
		section: unique ID num
		Some section assignments overlap
		elves sections in pairs
	*/

	// test case
	/* 	splitted = [
		'2-4,6-8',
		'2-3,4-5',
		'5-7,7-9',
		'2-8,3-7',
		'6-6,4-6',
		'2-6,4-8',
	]; */

	let totalPairs = 0;

	for (let i = 0; i < splitted.length; ++i) {
		// * SOLUTION 1
		if (splitted[i] == '') continue;
		const cur = String(splitted[i]).split(',');
		// console.log('cur: ', cur);

		const first = cur[0].split('-');
		const second = cur[1].split('-');

		const minOne = +first[0];
		const maxOne = +first[1];
		const minTwo = +second[0];
		const maxTwo = +second[1];

		// console.log(minOne, minTwo, maxOne, maxTwo);

		/* 		console.log(
			(minOne <= minTwo && maxOne >= maxTwo) ||
				(minOne >= minTwo && maxOne <= maxTwo)
		); */

		if (
			(minOne <= minTwo && maxOne >= maxTwo) ||
			(minOne >= minTwo && maxOne <= maxTwo)
		) {
			totalPairs++;
		}

		// * SOLUTION 2
		/* 		let arrOne = [];
		let arrTwo = [];

		for (let x = minOne; x <= maxOne; ++x) {
			arrOne.push('' + x);
		}
		for (let x = minTwo; x <= maxTwo; ++x) {
			arrTwo.push('' + x);
		}

		// console.log(arrOne, arrTwo);

		const nextOne = arrOne.join('');
		const nextTwo = arrTwo.join('');

		// console.log(arrOne);
		// console.log(arrTwo);

		// console.log(nextOne, nextTwo);
		console.log(
			arrOne.every((v) => arrTwo.includes(v)) ||
				arrTwo.every((v) => arrOne.includes(v))
		);

		if (
			arrOne.every((v) => arrTwo.includes(v)) ||
			arrTwo.every((v) => arrOne.includes(v))
		) {
			totalPairs++;
		}

		console.log(totalPairs); */
	}

	console.log('totalPairs: ', totalPairs);

	part2(input, splitted);
}

// * PART #2 (5 minutes) (simple - mostly similar code; changed "every" to "some" method to check if at least 1 value overlaps between the two ranges)
async function part2(input, splitted) {
	let totalPairs = 0;

	for (let i = 0; i < splitted.length; ++i) {
		if (splitted[i] == '') continue;
		const cur = String(splitted[i]).split(',');
		// console.log('cur: ', cur);

		const first = cur[0].split('-');
		const second = cur[1].split('-');

		const minOne = +first[0];
		const maxOne = +first[1];
		const minTwo = +second[0];
		const maxTwo = +second[1];

		// console.log(minOne, minTwo, maxOne, maxTwo);

		let arrOne = [];
		let arrTwo = [];

		for (let x = minOne; x <= maxOne; ++x) {
			arrOne.push('' + x);
		}
		for (let x = minTwo; x <= maxTwo; ++x) {
			arrTwo.push('' + x);
		}

		// console.log(arrOne, arrTwo);

		// console.log(nextOne, nextTwo);
		// console.log(arrOne.some((v) => arrTwo.includes(v)));

		if (arrOne.some((v) => arrTwo.includes(v))) {
			totalPairs++;
		}
	}

	console.log('totalPairs: ', totalPairs);
}
