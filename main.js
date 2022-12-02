const { request } = require('undici');
const {
	readdirSync,
	mkdirSync,
	writeFileSync,
	copyFileSync,
	readFileSync,
} = require('fs');
const { join, dirname } = require('path');

async function getInput() {
	// get date & day
	let today = new Date();
	let day = today.getDate();
	// day = 2;

	const { statusCode, headers, trailers, body } = await request(
		`https://adventofcode.com/2022/day/${day}/input`,
		{
			headers: {
				cookie: 'session=53616c7465645f5f6aef6eb562c91b451329304176285cc126c927d5bfe2f2a4d51df90876b727d7cc857a7f0bcfdf107897ad84a7c9e8ef2a9aab99bd344b02',
			},
		}
	);

	let properPath = join(__dirname, `/${day}`);
	let text = await body.text();

	// make appropriate directory (if does not exist) & write to appropriate directory
	try {
		readdirSync(properPath);
	} catch (err) {
		mkdirSync(properPath);
	}

	writeFileSync(`./${day}/input.txt`, text);

	return text;
}
