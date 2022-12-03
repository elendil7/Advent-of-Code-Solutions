// * ATTEMPT 1 (47 minutes)

const fs = require('fs');
const readline = require('readline');
const { join } = require('path');

async function rockPaperScissorsPartOne() {
	const fileStream = fs.createReadStream(join(__dirname, 'input.txt'));

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	/* 
    Opponent:
        A = rock
        B = paper
        C = scissors
    You:
        X = rock
        Y = paper
        Z = scissors
    */

	let totalScore = 0;

	let map = {
		X: 1,
		Y: 2,
		Z: 3,
		A: 'X',
		B: 'Y',
		C: 'Z',
	};

	for await (const line of rl) {
		// console.log(line);
		let arr = line.split(' ');

		totalScore += map[arr[1]];

		// if draw
		if (map[arr[0]] == arr[1]) {
			totalScore += 3;
		}
		// if you lose
		else if (
			(arr[0] == 'A' && arr[1] == 'Z') ||
			(arr[0] == 'B' && arr[1] == 'X') ||
			(arr[0] == 'C' && arr[1] == 'Y')
		) {
			totalScore += 0;
			// else, you win
		} else {
			totalScore += 6;
		}
	}

	console.log(totalScore);
}

async function rockPaperScissorsPartTwo() {
	const fileStream = fs.createReadStream(join(__dirname, 'input.txt'));

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	/* 
    Opponent:
        A = rock
        B = paper
        C = scissors
    You:
        X = rock
        Y = paper
        Z = scissors
    */

	let totalScore = 0;

	let draw = {
		A: 'rock',
		B: 'paper',
		C: 'scissors',
		rock: 1,
		paper: 2,
		scissors: 3,
	};

	let lose = {
		A: 'scissors',
		B: 'rock',
		C: 'paper',
		rock: 1,
		paper: 2,
		scissors: 3,
	};

	let win = {
		A: 'paper',
		B: 'scissors',
		C: 'rock',
		rock: 1,
		paper: 2,
		scissors: 3,
	};

	for await (const line of rl) {
		// console.log(line);
		let arr = line.split(' ');

		if (arr[1] == 'Y') {
			totalScore += 3 + draw[draw[arr[0]]];
		} else if (arr[1] == 'X') {
			totalScore += 0 + lose[lose[arr[0]]];
		} else {
			totalScore += 6 + win[win[arr[0]]];
		}
	}

	console.log(totalScore);
}

rockPaperScissorsPartOne();
rockPaperScissorsPartTwo();

// * ATTEMPT 2 (20 minutes)

const { getInput } = require(`../main.js`);

const start = async () => {
	const input = await getInput();
	// console.log(input);
	part1(input, (arr = []));
};

start();

// * PART 1
async function part1(input, arr) {
	let mapOne = {
		A: 'X', // rock
		B: 'Y', // paper
		C: 'Z', // scissors
	};
	let mapTwo = {
		X: 1,
		Y: 2,
		Z: 3,
	};

	arr = input.split('\n');

	// for each match
	let totalPoints = arr
		.map((v) => {
			if (!v) return 0;

			let total = 0;

			const cur = v.split(' ');

			let opponent = cur[0];
			let you = cur[1];

			// add num to total
			total += mapTwo[you];

			// if draw
			if (mapOne[opponent] == you) {
				total += 3;
				// if you lost
			} else if (
				(opponent == 'A' && you == 'Z') ||
				(opponent == 'B' && you == 'X') ||
				(opponent == 'C' && you == 'Y')
			) {
				total += 0;
				// if you won
			} else {
				total += 6;
			}

			return total;
		})
		.reduce((a, b) => a + b, 0);

	console.log(totalPoints);

	part2(input, arr, mapOne, mapTwo);
}

// * PART 2
async function part2(input, arr, mapOne, mapTwo) {
	let lose = {
		A: 3,
		B: 1,
		C: 2,
	};

	let win = {
		A: 2,
		B: 3,
		C: 1,
	};

	// for each match
	let totalPoints = arr
		.map((v) => {
			if (!v) return 0;

			let total = 0;

			const cur = v.split(' ');

			let opponent = cur[0];
			let you = cur[1];

			// if draw
			if (you == 'Y') {
				total += 3 + mapTwo[mapOne[opponent]];
				// if you lost
			} else if (you == 'X') {
				total += 0 + lose[opponent];
				// if you won
			} else {
				total += 6 + win[opponent];
			}

			return total;
		})
		.reduce((a, b) => a + b, 0);

	console.log(totalPoints);
}
