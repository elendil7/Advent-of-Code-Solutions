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

// * ATTEMPT #1 (02:49:15 - 2 hours 49 minutes 15 seconds) (execution on point but intent lacked in some areas)

// * PART #1
async function part1(input) {
	//console.log(input);

	let split = input.splitInputEveryNLines(1).map((v) => `` + v);

	//console.log(split);

	let visibleTrees = 0;

	// * Write code here:
	// for each grid (column)
	for (let x = 0; x < split.length; ++x) {
		// for each grid (row)
		for (let y = 0; y < split[x].length; ++y) {
			const cur = +split[x][y];

			// get above and below trees
			let above = [];
			let below = [];
			let left = [];
			let right = [];

			// above
			for (let n = 0; n < x; ++n) {
				if (cur <= +split[n][y]) above.push(+split[n][y]);
			}
			// below
			for (let n = x + 1; n < split.length; ++n) {
				if (cur <= +split[n][y]) below.push(+split[n][y]);
			}
			// left
			for (let n = 0; n < y; ++n) {
				if (cur <= +split[x][n]) left.push(+split[x][n]);
			}
			// right
			for (let n = y + 1; n < split.length; ++n) {
				if (cur <= +split[x][n]) right.push(+split[x][n]);
			}

			//console.log(`\nCurrent: ${cur}, Index: x: ${x}, Index y: ${y}`);
			// console.log(above, below, left, right);
			// console.log(above, below, left, right);

			// check if any missing trees (meaning cur tree is inherently visible)
			if (
				above.length == 0 ||
				below.length == 0 ||
				left.length == 0 ||
				right.length == 0
			) {
				visibleTrees++;
			}
		}
	}

	//console.log(`Array lengths: ${split.length}, ${split[0].length}`);

	console.log(visibleTrees);

	part2(input, split);
}

// * PART #2
async function part2(input, split) {
	// console.log(split);

	let totalScenicPoints = [];

	// for each grid (column)
	for (let x = 0; x < split.length; ++x) {
		// for each grid (row)
		for (let y = 0; y < split[x].length; ++y) {
			const cur = +split[x][y];

			// console.log(`Cur: ${cur}. Index: ${y}`);
			// console.log(split[x]);

			// get above and below trees
			let above = 0;
			let below = 0;
			let left = 0;
			let right = 0;

			let prevTreeHeight = -100;

			// above
			for (let n = x - 1; n >= 0; --n) {
				above++;
				const curTreeHeight = +split[n][y];
				if (cur <= curTreeHeight) {
					break;
				}
				prevTreeHeight = curTreeHeight;
			}

			prevTreeHeight = -100;

			// below
			for (let n = x + 1; n < split.length; ++n) {
				below++;
				const curTreeHeight = +split[n][y];
				if (cur <= curTreeHeight) {
					break;
				}
				prevTreeHeight = curTreeHeight;
			}

			prevTreeHeight = -100;

			// left
			for (let n = y - 1; n >= 0; --n) {
				left++;
				const curTreeHeight = +split[x][n];
				if (cur <= curTreeHeight) {
					break;
				}
				prevTreeHeight = curTreeHeight;
			}

			prevTreeHeight = -100;

			// right
			for (let n = y + 1; n < split.length; ++n) {
				right++;
				const curTreeHeight = +split[x][n];
				if (cur <= curTreeHeight) {
					break;
				}
				prevTreeHeight = curTreeHeight;
			}

			// console.log(`Above: ${above}, Below: ${below}, Left: ${left}, Right: ${right}`);

			totalScenicPoints.push(above * below * right * left);
		}
	}

	// console.log(totalScenicPoints);
	console.log(totalScenicPoints.getBiggestNum());
}
