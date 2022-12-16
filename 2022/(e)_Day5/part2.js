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
	const data = await fetchInput(5, 2022);
	return data instanceof Error ? console.error(data.message) : task(data);
};
start();

async function constructStacks(stackRows, totalStacks) {
	// console.log(`Totalstacks: ${3}, StackRows: `, stackRows);
	// make array of length "n" (representing number of stacks), to be filled in next part of code.
	let filledStacks = [...Array(totalStacks)].map((v) => []);
	// console.log(filledStacks);

	// loop through each row of stacks
	for (let row = 0; row < totalStacks; row++) {
		// push stack from each row to the array (ignore whitespace & [], just get the letter itself)
		for (let col = 0; col < stackRows.length; col++) {
			/* 			console.log(
				`Row: ${row}, Column: ${col}, Crate: ${
					stackRows[col][row * 4 + 1]
				}`
			); */
			// get current stack (or whitespace)
			const curStack = stackRows[col][row * 4 + 1];
			// push current crate to its designated stack (if not whitespace)
			if (curStack !== ' ') filledStacks[row].push(curStack);
		}
		// console.log(`Filled stacks: `, filledStacks);
	}

	// return array of filled stacks
	return filledStacks;
}

async function instructionParser(unintelligibleInstructions) {
	// split current instruction by spaces to get more parsable list
	const somewhatComprehensibleInstructions =
		unintelligibleInstructions.split(' ');
	// ensure current instruction is a number, then convert them from a String to an Integer
	const onlyNumbers = somewhatComprehensibleInstructions
		.filter((v) => /\d/.test(v))
		.map((v) => +v);
	// put everything into a clean object and return it. Compensate for array index starting at 0 by subtracting 1 from source & destinatin stacks.
	const cleanObject = {
		howManyStacksToMove: onlyNumbers[0],
		sourceStack: onlyNumbers[1] - 1,
		destinationStack: onlyNumbers[2] - 1,
	};
	return cleanObject;
}

async function task(input) {
	// get stacks & instructions separately through destructuring
	const [stackRows, allInstructions] = await input.splitInputEveryBlankLine();
	// get last element to figure out how many rows of stacks there are
	const totalStacks = +stackRows.pop().slice(-2);
	// get stacks by column rather than by row
	const stacks = await constructStacks(stackRows, totalStacks);

	//console.log(stacks);

	// parse current row of instructions, and move crates across stacks accordingly
	for (let i = 0; i < allInstructions.length; i++) {
		const unintelligibleInstruction = allInstructions[i];
		const normalInstruction = await instructionParser(
			unintelligibleInstruction
		);

		//console.log(normalInstruction);

		// remove N crates from the source stack (all at once) and add them to destination stack
		let stolenCrates = [];
		for (let x = 0; x < normalInstruction.howManyStacksToMove; ++x) {
			stolenCrates.push(stacks[normalInstruction.sourceStack].shift());
		}
		for (let x = stolenCrates.length - 1; x >= 0; --x) {
			stacks[normalInstruction.destinationStack].unshift(stolenCrates[x]);
		}

		//console.log(`Stolen crates: `, stolenCrates);
		//console.log(`Stacks: `, stacks);
	}

	// get top of each stack for answer
	const tops = stacks.map((v) => v[0]).join('');
	console.log(tops);
}
