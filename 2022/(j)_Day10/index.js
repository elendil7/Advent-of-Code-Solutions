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
	const data = await fetchInput(10, 2022);
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1

// * PART #1
async function part1(input) {
	/*
		Clock circuit runs at 1 cycle per tick
		CPU register "X" starts at value "1"
		CPU register supports 2 instructions:
			- "addx V" tajes 2 cycles to complete. After 2 cycles, X register is increased by value V. (V can be negative).
			- "noop" tkaes 1 cycle to complete. It has no other effect.


	*/

	const lines = await input.splitInputEveryNLines(1);

	let signalStrengths = [];
	let netCycles = 0;
	let X = 1;

	// for each instruction
	for (let i = 0; i < lines.length; i++) {
		let [instruction, value] = String(lines[i]).split(' ');
		value = !value ? 0 : parseInt(value);

		netCycles += 1;

		// if signal strength multiplier
		if ((netCycles + 20) % 40 === 0 || netCycles === 20) {
			signalStrengths.push(netCycles * X);
		}

		if (instruction === 'addx') {
			netCycles += 1;
			// if signal strength multiplier
			if ((netCycles + 20) % 40 === 0 || netCycles === 20) {
				signalStrengths.push(netCycles * X);
			}
		}

		X += value;

		/* 		console.log(
			`netCycles: ${netCycles}\nX: ${X}\nSignalStrengths: ${signalStrengths}\n`
		); */
	}

	console.log(signalStrengths.getSum());

	part2(input, lines);
}

// * PART #2
async function part2(input, lines) {
	console.log();

	/* 
		unlit pixel: "."
		lit pixel: "#"
	*/

	let CRT = tools.populateArray(1, 6).map((v) => '.'.repeat(40).split(''));
	let arr = [];
	let signalStrengths = [];
	let netCycles = 0;
	let X = 1;

	// for each instruction
	for (let i = 0; i < lines.length; i++) {
		let [instruction, value] = String(lines[i]).split(' ');
		value = !value ? 0 : parseInt(value);

		netCycles += 1;
		if (Math.abs(X - ((netCycles - 1) % 40)) <= 1) arr.push('#');
		else arr.push(' ');

		// if signal strength multiplier
		if ([20, 60, 100, 140, 180, 220].includes(netCycles)) {
			signalStrengths.push(netCycles * X);
		}

		if (instruction === 'addx') {
			netCycles += 1;
			// if signal strength multiplier
			if ([20, 60, 100, 140, 180, 220].includes(netCycles)) {
				signalStrengths.push(netCycles * X);
			}
			if (Math.abs(X - ((netCycles - 1) % 40)) <= 1) arr.push('#');
			else arr.push(' ');
		}

		X += value;

		/* 		console.log(
			`netCycles: ${netCycles}\nX: ${X}\nSignalStrengths: ${signalStrengths}\n`
		); */
	}

	// console.log(CRT.map((v) => v.join('')).map((v) => `${v}`));

	let outputArr = [];
	let temp = [];
	for (let i = 0; i < arr.length; i++) {
		const element = arr[i];
		temp.push(element);
		if ((i + 1) % 40 === 0) {
			outputArr.push(temp.join(''));
			temp = [];
		}
	}

	console.log(outputArr);

	attempt2Part2(input, lines);
}

// * ATTEMPT 2

// * PART #2 (26 minutes, 35 seconds)
async function attempt2Part2(input, lines) {
	let arr = [];
	let signalStrengths = [];
	let netCycles = 0;
	let X = 1;

	for (let i = 0; i < lines.length; i++) {
		let [instruction, value] = String(lines[i]).split(' ');
		value = !value ? 0 : parseInt(value);

		netCycles += 1;

		// check pixel pos after 2nd cycle
		if (
			Math.abs(X - ((netCycles % 40) - 1)) === 1 ||
			Math.abs(X - ((netCycles % 40) - 1)) === 0
		) {
			arr.push('#');
		} else {
			arr.push(' ');
		}

		if ((netCycles + 20) % 40 === 0 || netCycles === 20) {
			signalStrengths.push(netCycles * X);
		}

		if (instruction === 'addx') {
			netCycles += 1;

			// check pixel pos after 2nd cycle
			if (
				Math.abs(X - ((netCycles % 40) - 1)) === 1 ||
				Math.abs(X - ((netCycles % 40) - 1)) === 0
			) {
				arr.push('#');
			} else {
				arr.push(' ');
			}

			if ((netCycles + 20) % 40 === 0 || netCycles === 20) {
				signalStrengths.push(netCycles * X);
			}
		}

		X += value;
	}

	let output = '';
	let temp = [];

	for (let i = 0; i < arr.length; i++) {
		const cur = String(arr[i]);
		temp.push(cur);
		if ((i + 1) % 40 === 0) {
			output += `${temp.join('')}\n`;
			temp = [];
		}
	}

	console.log(output);
}
