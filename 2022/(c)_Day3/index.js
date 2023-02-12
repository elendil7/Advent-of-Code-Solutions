// * ATTEMPT 1 (2 hours 20 minutes) (AoC input window scuffed moment - code was right the whole time... Always has been!)

const fs = require('fs');
const { join } = require('path');
const { fetchInput } = require('../../src/API/fetchInput');

const start = async () => {
	const input = await fetchInput(3, 2022);
	// console.log(input);
	part1(input, (arr = []));

	part1Attempt2(input, (arr = []));
	part2Attempt2(input, (arr = []));
};

start();

// * PART 1
async function part1(input, arr) {
	arr = input.split('\n');
	// console.log(arr);

	let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
		''
	);
	let letters = [];

	arr.forEach((v) => {
		let mid = v.length / 2;
		let one = v.slice(0, mid);
		let two = v.slice(mid);

		//console.log(v);
		//console.log(one, two);

		alphabet.forEach((v) => {
			if (one.includes(v) && two.includes(v)) letters.push(v);
		});

		// console.log(letters);
	});

	let sum =
		letters.length + letters.reduce((a, b) => a + alphabet.indexOf(b), 0);

	console.log(sum);

	part2(input, arr, alphabet);
}

// * PART 2
async function part2(input, arr, alphabet) {
	arr = input.split('\n');
	let tripletPairs = [];
	let temp = [];

	arr.forEach((v, i) => {
		temp.push(v);
		if (i !== 0 && (i + 1) % 3 == 0) {
			tripletPairs.push(temp);
			temp = [];
		}
	});

	// console.log(tripletPairs, tripletPairs.length);

	let letters = [];

	tripletPairs.forEach((v) => {
		let one = v[0];
		let two = v[1];
		let three = v[2];

		// console.log(one, two, three);

		alphabet.forEach((x) => {
			if (one.includes(x) && two.includes(x) && three.includes(x))
				letters.push(x);
		});
	});

	// console.log(letters, letters.length);

	let sum =
		letters.length + letters.reduce((a, b) => a + alphabet.indexOf(b), 0);

	console.log(sum);
}

// * ATTEMPT 2

// * PART 1
async function part1Attempt2(x) {
	j = [...`.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`];
	// j=(z=>[...('.'+z+z.toUpperCase())])(`abcdefghijklmnopqrstuvwxyz`);

	t = []
		.concat(
			...x
				.split('\n')
				.map((v) =>
					j.filter((x) =>
						((m) =>
							v.slice(0, m).includes(x) &&
							v.slice(m).includes(x))(v.length / 2)
					)
				)
		)
		.reduce((a, b) => a + j.indexOf(b), 0);

	console.log(t);
}

// * PART 2
async function part2Attempt2(input, arr) {}
