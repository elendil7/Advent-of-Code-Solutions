require('dotenv').config();
const { getDay } = require('../utils/misc/getDay');
const { getFullPaths } = require('../utils/main/getFullPaths');
const { request } = require('undici');
const { readdirSync, mkdirSync, writeFileSync } = require('fs');

async function fetchInput() {
	const { statusCode, headers, trailers, body } = await request(
		`https://adventofcode.com/2022/day/${await getDay()}/input`,
		{
			headers: {
				cookie: `session=${process.env.COOKIE_HASH}`,
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
