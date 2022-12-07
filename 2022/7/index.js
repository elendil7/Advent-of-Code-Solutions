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

// * ATTEMPT #1 (took far too long, but method was unique and simple in the end)

// * PART #1
async function part1(input) {
	// console.log(input);

	// split input every "n" lines.
	const split = await input.splitInputEveryNLines(1);
	// console.log('SplitEveryNLines: ', split);

	let totals = {};
	totals['/'] = 0;
	let root = 0;

	function generateTree() {
		let curPathStr = '';

		for (let i = 0; i < split.length; i++) {
			const cur = String(split[i]).split(' ');

			// console.log(curPathStr);
			// console.log(cur);

			// can be "cd" or "ls" command
			if (cur[0] === '$') {
				if (cur[1] == 'cd') {
					if (cur[2] == '..') {
						curPathStr = curPathStr
							.split('/')
							.slice(0, -1)
							.join('/');
					} else if (cur[2] != '/') {
						curPathStr = curPathStr
							.split('/')
							.concat(cur[2])
							.join('/');
						if (!totals[curPathStr]) {
							totals[curPathStr] = 0;
						}
					}
				}
				// if file size shown
			} else if (/[0-9]/.test(cur[0])) {
				root += +cur[0];
				for (let key in totals) {
					if (curPathStr.includes(key)) {
						totals[key] += +cur[0];
					}
				}
			}
		}
	}

	generateTree();

	let finalSum = 0;
	for (let key in totals) {
		const cur = totals[key];
		if (cur <= 100000) {
			finalSum += cur;
		}
	}

	// console.log(totals);
	console.log(finalSum);

	part2(input, totals, root);
}

// * PART #2
async function part2(input, totals, root) {
	const totalDiskSpace = 70000000;
	const requiredDiskSpace = 30000000;
	// get minimum deletion size required to attain sufficient disk space
	const minimumDeletionSize = requiredDiskSpace - (totalDiskSpace - root);

	// sort object by its values (es6 shorthand method).
	// then use filter to cut off the irrelevant values (< minimumDeletionSize)
	let sortedObject = Object.values(totals)
		.sort((a, b) => a - b)
		.filter((v) => v >= minimumDeletionSize);

	// console.log(sortedObject);
	// console.log('minimumDeletionSize: ', minimumDeletionSize);
	// console.log(root)
	console.log(sortedObject[0]);
}
