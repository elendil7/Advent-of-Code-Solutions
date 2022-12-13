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
async function compare(left, right, parentArrLeft, parentArrRight) {
	console.log(left, right);

	// if both values are integers
	if (Number.isInteger(left) && Number.isInteger(right)) {
		console.log(`Compare ${left} vs ${right}`);

		if (left > right) {
			return false;
		} else {
			return compare(
				left[i + 1],
				right[i + 1],
				parentArrLeft,
				parentArrRight
			);
		}
	}

	for (let i = 0; i < right.length; i++) {
		const curLeft = left[i];
		const curRight = right[i];

		// if both values are arrays
		if (Array.isArray(left) && Array.isArray(right)) {
			compare(curLeft, curRight, left, right);
		}
	}
}

// * PART #1
async function part1(input) {
	const pairs = await input.splitInputEveryBlankLine();
	console.log(pairs);

	let totalIndexesOfPairsInOrder = 0;

	/* 	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i];
		if (await compare(JSON.parse(pair[0]), JSON.parse(pair[1]), [])) {
			totalNumOfPairsInOrder += i + 1;
			console.log(`Total pairs in order: `, totalNumOfPairsInOrder);
		}
	} */

	for (let i = 0; i < pairs.length; i++) {
		const curPair = pairs[i];
		const left = JSON.parse(curPair[0]);
		const right = JSON.parse(curPair[1]);
		// flatten arrays
		let flatArrLeft = (left + '').split(',');
		let flatArrRight = (right + '').split(',');

		console.log(`\nCompare pair ${i + 1}:`);
		console.log(flatArrLeft, flatArrRight);

		for (let j = 0; j < flatArrRight.length; j++) {
			const curLeft = +flatArrLeft[j];
			const curRight = +flatArrRight[j];

			if (
				!curLeft &&
				JSON.stringify(curLeft) > JSON.stringify(curRight)
			) {
				totalIndexesOfPairsInOrder += i + 1;
				console.log('In order!');
				break;
			}
			console.log(curLeft, curRight);
			if (curLeft < curRight) {
				totalIndexesOfPairsInOrder += i + 1;
				console.log('In order!');
				break;
			} else if (curRight < curLeft) {
				console.log('Not in order...');
				break;
			}
		}
		console.log(`Total pairs in order: `, totalIndexesOfPairsInOrder);
	}

	console.log(`Total pairs in order: `, totalIndexesOfPairsInOrder);

	part2(input);
}

// * PART #2
async function part2(input) {}
