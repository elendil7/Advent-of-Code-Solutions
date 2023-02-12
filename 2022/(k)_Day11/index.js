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
	// initializeTools();
	initializeInputExtractionTools();
	const data = await fetchInput(11, 2022);
	return data instanceof Error ? console.error(data.message) : part1(data);
};
start();

// * ATTEMPT #1

async function sortHighToLow(monkeys) {
	let sortable = [];
	for (let monkey in monkeys) {
		sortable.push([monkey, monkeys[monkey].inspectedItemsCount]);
	}
	sortable.sort((a, b) => b[1] - a[1]);
	return sortable;
}

// * PART #1
async function part1(input) {
	const lines = await input.splitInputEveryBlankLine();
	// console.log(lines);

	let monkeys = {};

	// generate monkey objects
	for (let i = 0; i < lines.length; i++) {
		const curMonkey = lines[i];

		// remove whitespace from all monkey attribute lines
		let whiteSpaceRemoved = [];
		for (let i = 0; i < curMonkey.length; i++) {
			const cur = String(curMonkey[i]).replace(/\s/g, '');
			whiteSpaceRemoved.push(cur);
		}
		// console.log(whiteSpaceRemoved);

		// make monkey if does not exist
		const monkeyName = whiteSpaceRemoved[0].replace(/\D/g, '');
		monkeys[monkeyName] = {
			items: whiteSpaceRemoved[1].split(':')[1].split(','),
			operation: whiteSpaceRemoved[2].split(':')[1].split(/old(.*)/s)[1],
			test: whiteSpaceRemoved[3].split(':')[1].replace(/\D/g, ''),
			ifTrue: whiteSpaceRemoved[4].split(':')[1].replace(/\D/g, ''),
			ifFalse: whiteSpaceRemoved[5].split(':')[1].replace(/\D/g, ''),
			inspectedItemsCount: 0,
		};
	}

	//console.log(monkeys);

	// for 20 rounds
	for (let x = 1; x <= 20; ++x) {
		// loop through each monkey
		for (let monkey in monkeys) {
			let curMonkey = monkeys[monkey];
			//console.log(monkey, curMonkey);

			const items = curMonkey.items;

			// for each item
			while (items.length > 0) {
				const item = +items[0];

				const operation = curMonkey.operation[0];
				const number = curMonkey.operation.slice(1);
				const test = +curMonkey.test;
				const ifTrue = curMonkey.ifTrue;
				const ifFalse = curMonkey.ifFalse;

				//console.log(operation, number, test, ifTrue, ifFalse);

				let worryLevel = eval(
					`${item}${operation}${number == 'old' ? item : +number}`
				);
				worryLevel = Math.floor(worryLevel / 3);

				//console.log('worry:', worryLevel);

				// if true, throw to monkey ifFalse, else throw to ifTrue
				if (worryLevel % test == 0) {
					// throw to other monkey
					monkeys[ifTrue].items.push(`` + worryLevel);
				} else {
					monkeys[ifFalse].items.push(`` + worryLevel);
				}

				// remove value from cur monkey
				monkeys[monkey].items.shift();
				monkeys[monkey].inspectedItemsCount++;
			}

			//console.log(monkeys);
		}
	}

	let sortedMonkeys = await sortHighToLow(monkeys);

	// get highest two
	let topTwo = sortedMonkeys
		.slice(0, 2)
		.map((v) => v[1])
		.reduce((a, b) => a * b, 1);
	//console.log(sortedMonkeys);
	//console.log(sortedMonkeys.slice(0, 2).map((v) => v[1]));
	console.log(topTwo);

	part2(input, lines);
}

// * PART #2
async function part2(input, lines) {
	let monkeys = {};

	// generate monkey objects
	for (let i = 0; i < lines.length; i++) {
		const curMonkey = lines[i];

		// remove whitespace from all monkey attribute lines
		let whiteSpaceRemoved = [];
		for (let i = 0; i < curMonkey.length; i++) {
			const cur = String(curMonkey[i]).replace(/\s/g, '');
			whiteSpaceRemoved.push(cur);
		}
		// console.log(whiteSpaceRemoved);

		// make monkey if does not exist
		const monkeyName = whiteSpaceRemoved[0].replace(/\D/g, '');
		monkeys[monkeyName] = {
			items: whiteSpaceRemoved[1].split(':')[1].split(','),
			operation: whiteSpaceRemoved[2].split(':')[1].split(/old(.*)/s)[1],
			test: whiteSpaceRemoved[3].split(':')[1].replace(/\D/g, ''),
			ifTrue: whiteSpaceRemoved[4].split(':')[1].replace(/\D/g, ''),
			ifFalse: whiteSpaceRemoved[5].split(':')[1].replace(/\D/g, ''),
			inspectedItemsCount: 0,
			monkeyRoof: 0,
		};
	}

	//console.log(monkeys);

	let monkeyRoof = 1;
	for (let monkey in Object.keys(monkeys)) {
		monkeyRoof *= monkeys[monkey].test;
	}

	// for 20 rounds
	for (let x = 1; x <= 10000; ++x) {
		// loop through each monkey
		for (let monkey in monkeys) {
			let curMonkey = monkeys[monkey];
			//console.log(monkey, curMonkey);

			const items = curMonkey.items;

			// for each item
			while (items.length > 0) {
				const item = +items[0];

				const operation = curMonkey.operation[0];
				const number = curMonkey.operation.slice(1);
				const test = +curMonkey.test;
				const ifTrue = curMonkey.ifTrue;
				const ifFalse = curMonkey.ifFalse;

				//console.log(operation, number, test, ifTrue, ifFalse);

				let worryLevel = eval(
					`${item}${operation}${number == 'old' ? item : +number}`
				);

				//console.log(worryLevel);

				//console.log('worry:', worryLevel);

				// if true, throw to monkey ifFalse, else throw to ifTrue
				if (worryLevel % test == 0) {
					// throw to other monkey
					monkeys[ifTrue].items.push(worryLevel % monkeyRoof);
				} else {
					monkeys[ifFalse].items.push(worryLevel % monkeyRoof);
				}

				// remove value from cur monkey
				monkeys[monkey].items.shift();
				monkeys[monkey].inspectedItemsCount++;
			}

			//console.log(monkeys);
		}

		// console.log(await sortHighToLow(monkeys));
	}

	let sortedMonkeys = await sortHighToLow(monkeys);

	// get highest two
	let topTwo = sortedMonkeys
		.slice(0, 2)
		.map((v) => v[1])
		.reduce((a, b) => a * b, 1);
	//console.log(sortedMonkeys);
	//console.log(sortedMonkeys.slice(0, 2).map((v) => v[1]));
	console.log(topTwo);
}
