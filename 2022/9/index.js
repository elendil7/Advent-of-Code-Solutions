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

// * PART #1
async function part1(input) {
	// console.log(input);

	// split input every "n" lines.
	const split = await input.splitInputEveryNLines(1);
	//console.log('SplitEveryNLines: ', split);

	// check if first move has been made (head moves first, tail moves last)
	let firstMove = true;
	// [x, y] coords (along the corridor & up the stairs...)
	let headCurPos = [0, 0];
	let tailCurPos = [0, 0];
	// object for storing total times each coord is visited by T.
	let numOfTimesTailVisitedPos = {};

	async function addToObjectPartOne(tailCurPos) {
		const tailCurPosStr = tailCurPos.join(',');
		if (!numOfTimesTailVisitedPos[tailCurPosStr]) {
			numOfTimesTailVisitedPos[tailCurPosStr] = 1;
		} else {
			numOfTimesTailVisitedPos[tailCurPosStr]++;
		}
	}

	for (let i = 0; i < split.length; ++i) {
		const cur = String(split[i]).split(' ');
		const direction = cur[0];
		const timesMoved = +cur[1];

		for (let x = 0; x < timesMoved; ++x) {
			// * head moves first...
			if (direction == 'L') {
				headCurPos = [headCurPos[0] - 1, headCurPos[1]];
			} else if (direction == 'R') {
				headCurPos = [headCurPos[0] + 1, headCurPos[1]];
			} else if (direction == 'D') {
				headCurPos = [headCurPos[0], headCurPos[1] - 1];
			} else if (direction == 'U') {
				headCurPos = [headCurPos[0], headCurPos[1] + 1];
			}

			// * tails moves last...
			if (firstMove == false) {
				if (
					Math.abs(headCurPos[0] - tailCurPos[0]) +
						Math.abs(headCurPos[1] - tailCurPos[1]) ===
					3
				) {
					// move diagonally (if applicable)
					if (
						// left-down
						headCurPos[0] < tailCurPos[0] &&
						headCurPos[1] < tailCurPos[1]
					) {
						tailCurPos = [tailCurPos[0] - 1, tailCurPos[1] - 1];
					} else if (
						// right-down
						headCurPos[0] > tailCurPos[0] &&
						headCurPos[1] < tailCurPos[1]
					) {
						tailCurPos = [tailCurPos[0] + 1, tailCurPos[1] - 1];
					} else if (
						// left-up
						headCurPos[0] < tailCurPos[0] &&
						headCurPos[1] > tailCurPos[1]
					) {
						tailCurPos = [tailCurPos[0] - 1, tailCurPos[1] + 1];
					} else if (
						// right-up
						headCurPos[0] > tailCurPos[0] &&
						headCurPos[1] > tailCurPos[1]
					) {
						tailCurPos = [tailCurPos[0] + 1, tailCurPos[1] + 1];
					}
					// add the coords to the hashmap (object)
					await addToObjectPartOne(tailCurPos);
				} else if (
					Math.abs(headCurPos[0] - tailCurPos[0]) +
						Math.abs(headCurPos[1] - tailCurPos[1]) ===
						2 &&
					(headCurPos[0] === tailCurPos[0] ||
						headCurPos[1] === tailCurPos[1])
				) {
					// move in a linear fashion (up, down, left, right)
					if (direction == 'L') {
						tailCurPos = [tailCurPos[0] - 1, tailCurPos[1]];
					} else if (direction == 'R') {
						tailCurPos = [tailCurPos[0] + 1, tailCurPos[1]];
					} else if (direction == 'D') {
						tailCurPos = [tailCurPos[0], tailCurPos[1] - 1];
					} else if (direction == 'U') {
						tailCurPos = [tailCurPos[0], tailCurPos[1] + 1];
					}
					await addToObjectPartOne(tailCurPos);
				}
			}

			firstMove = false;

			/* 			console.log(`Cur: `, cur);
			console.log('Head pos: ', headCurPos);
			console.log('Tail pos: ', tailCurPos); */
		}
	}

	// console.log(numOfTimesTailVisitedPos);
	// print total number of coors that were visited by tail (T) >= 1 times, plus 1 to account for [0, 0]
	console.log(
		numOfTimesTailVisitedPos.sortByValues().filter((v) => v >= 1).length + 1
	);

	part2(input, split);
}

// * PART #2
async function part2(input, split) {
	async function getNodePos(prevNodePos, curNodePos, direction) {
		/* 		console.log(
			'(before) getNodePos params: ',
			prevNodePos,
			curNodePos,
			direction
		); */
		// * tail moves last...
		if (
			// must be 3 steps away from the parent node (only possible with different axis)
			Math.abs(prevNodePos[0] - curNodePos[0]) +
				Math.abs(prevNodePos[1] - curNodePos[1]) >=
			3
		) {
			// move diagonally (if applicable)
			if (
				// left-down
				prevNodePos[0] < curNodePos[0] &&
				prevNodePos[1] < curNodePos[1]
			) {
				curNodePos = [curNodePos[0] - 1, curNodePos[1] - 1];
			} else if (
				// right-down
				prevNodePos[0] > curNodePos[0] &&
				prevNodePos[1] < curNodePos[1]
			) {
				curNodePos = [curNodePos[0] + 1, curNodePos[1] - 1];
			} else if (
				// left-up
				prevNodePos[0] < curNodePos[0] &&
				prevNodePos[1] > curNodePos[1]
			) {
				curNodePos = [curNodePos[0] - 1, curNodePos[1] + 1];
			} else if (
				// right-up
				prevNodePos[0] > curNodePos[0] &&
				prevNodePos[1] > curNodePos[1]
			) {
				curNodePos = [curNodePos[0] + 1, curNodePos[1] + 1];
			}
			// add the coords to the hashmap (object)
			/* 			console.log(
				'(after) getNodePos params: ',
				prevNodePos,
				curNodePos,
				direction
			); */
			return [true, curNodePos];
		} else if (
			// must be 2 steps away from parent node, and must be on the same X or Y axis as the parent node.
			Math.abs(prevNodePos[0] - curNodePos[0]) +
				Math.abs(prevNodePos[1] - curNodePos[1]) ==
				2 &&
			(prevNodePos[0] === curNodePos[0] ||
				prevNodePos[1] === curNodePos[1])
		) {
			// move in a linear fashion (up, down, left, right)
			if (direction == 'L') {
				curNodePos = [curNodePos[0] - 1, curNodePos[1]];
			} else if (direction == 'R') {
				curNodePos = [curNodePos[0] + 1, curNodePos[1]];
			} else if (direction == 'D') {
				curNodePos = [curNodePos[0], curNodePos[1] - 1];
			} else if (direction == 'U') {
				curNodePos = [curNodePos[0], curNodePos[1] + 1];
			}
			/* 			console.log(
				'(after) getNodePos params: ',
				prevNodePos,
				curNodePos,
				direction
			); */
			return [true, curNodePos];
		}

		/* 			console.log(`Cur: `, cur);
			console.log('Head pos: ', headCurPos);
			console.log('Tail pos: ', tailCurPos); */
		return [false, curNodePos];
	}

	let firstMove = true;
	let ropeKnots = tools.populateArray(1, 10).map((v) => [0, 0]);
	// let allTails = [];
	let allTailsObj = {};

	async function addToObjectPartOne(tailCurPos) {
		const tailCurPosStr = tailCurPos.join(',');
		if (!allTailsObj[tailCurPosStr]) {
			allTailsObj[tailCurPosStr] = 1;
		} else {
			allTailsObj[tailCurPosStr]++;
		}
	}

	// cycle through instructions
	for (let i = 0; i < split.length; ++i) {
		const cur = String(split[i]).split(' ');
		const direction = cur[0];
		const timesMoved = +cur[1];

		// move timesMoved number of times, derived from instructions. 1 movement per loop iteration (cycle).
		for (let x = 0; x < timesMoved; ++x) {
			// * head moves first...
			if (direction == 'L') {
				ropeKnots[0] = [ropeKnots[0][0] - 1, ropeKnots[0][1]];
			} else if (direction == 'R') {
				ropeKnots[0] = [ropeKnots[0][0] + 1, ropeKnots[0][1]];
			} else if (direction == 'D') {
				ropeKnots[0] = [ropeKnots[0][0], ropeKnots[0][1] - 1];
			} else if (direction == 'U') {
				ropeKnots[0] = [ropeKnots[0][0], ropeKnots[0][1] + 1];
			}

			// console.log('Rope knots', ropeKnots);

			// do not move for the first iteration, then move freely after (heat must get 2 <= x <= 3 spaces ahead first before we move the ropeKnots to follow head)
			if (firstMove == false) {
				// * ropeKnots move sequentially, following head
				for (let y = 1; y < ropeKnots.length; ++y) {
					// for all ropeKnots (besides head, but uses head to adjust position of nodes chronologically)
					ropeKnots[y] = (
						await getNodePos(
							ropeKnots[y - 1],
							ropeKnots[y],
							direction
						)
					)[1];

					//console.log(`y:  ${y}. RopeKnots[y]: ${ropeKnots[y]}`);

					// for tail
					if (y === ropeKnots.length - 1) {
						addToObjectPartOne(ropeKnots[y]);
					}
				}
			}

			firstMove = false;
		}
	}

	// console.log(numOfTimesTailVisitedPos);
	// print total number of coors that were visited by tail (T) >= 1 times, plus 1 to account for [0, 0]
	const allTailsArr = allTailsObj.sortLowToHigh();
	console.log(allTailsArr, allTailsArr.length);
}
