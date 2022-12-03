const { getDay } = require('../utils/misc/getDay');
const { getFullPaths } = require('../utils/main/getFullPaths');
const { request } = require('undici');
const { readdirSync, mkdirSync, writeFileSync } = require('fs');

async function fetchInput() {
	const { statusCode, headers, trailers, body } = await request(
		`https://adventofcode.com/2022/day/${await getDay()}/input`,
		{
			headers: {
				cookie: 'session=53616c7465645f5f6aef6eb562c91b451329304176285cc126c927d5bfe2f2a4d51df90876b727d7cc857a7f0bcfdf107897ad84a7c9e8ef2a9aab99bd344b02',
			},
		}
	);

	let text = await body.text();
	let fullPath = (await getFullPaths())[1];

	// make appropriate directory (if does not exist) & write to appropriate directory
	try {
		readdirSync(fullPath);
	} catch (err) {
		mkdirSync(fullPath);
	}

	writeFileSync(`${fullPath}/input.txt`, text);

	return text;
}

module.exports = { fetchInput };
