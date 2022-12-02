// * ATTEMPT 1

const fs = require('fs');
const readline = require('readline');
const { join } = require('path');

async function getHighestCalories() {
	const fileStream = fs.createReadStream(join(__dirname, 'input.txt'));

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let curTotal = 0;
	let max = 0;

	for await (const line of rl) {
		if (line == '') {
			max = Math.max(max, curTotal);
			curTotal = 0;
		} else {
			curTotal += parseInt(line);
		}
	}

	console.log(max);
}

async function sumBiggestThree() {
	const fileStream = fs.createReadStream(join(__dirname, 'input.txt'));

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	let curTotal = 0;
	let topThree = [];

	for await (const line of rl) {
		if (line == '') {
			if (topThree.length < 3) {
				topThree.push(curTotal);
			} else {
				for (let i = 0; i < topThree.length; ++i) {
					if (topThree[i] < curTotal) {
						topThree[i] = curTotal;
						break;
					}
				}
			}
			curTotal = 0;
		} else {
			curTotal += parseInt(line);
		}
	}

	let sum = topThree.reduce((a, b) => a + b, 0);

	console.log(topThree);
	console.log(sum);
}

getHighestCalories();
sumBiggestThree();

// * ATTEMPT 2

const { getInput } = require(join(__dirname, `../main.js`));

const start = async () => {
	const input = await getInput();
	console.log(input);
	part1(input, (arr = []));
};

start();

async function part1(input, arr) {
	arr = input
		.split('\n\n')
		.map((v) => v.split('\n').reduce((a, b) => +a + +b, 0));

	console.log(arr);

	let max = Math.max(...arr);

	console.log(max);

	part2(input, arr);
}

async function part2(input, arr) {
	let topThreeAdded = arr
		.sort((a, b) => b - a)
		.slice(0, 3)
		.reduce((a, b) => a + b, 0);

	console.log(topThreeAdded);
}
