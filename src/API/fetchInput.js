require('dotenv').config();
const { getDay, getYear } = require('../utils/misc/getDate');
const { getFullPaths } = require('../utils/main/getFullPaths');
const { request } = require('undici');
const { readdirSync, mkdirSync, writeFileSync, readFileSync } = require('fs');

async function fetchInput() {
	const day = await getDay();
	const year = await getYear();
	const fullPath = (await getFullPaths())[1];

	// make appropriate directory (if does not exist)
	try {
		readdirSync(fullPath);
	} catch (err) {
		mkdirSync(fullPath);
	}

	// check local dir if input.txt exists
	try {
		const input = readFileSync(`${fullPath}/input.txt`, 'utf-8');
		return input;
		// otherwise, fetch input from website
	} catch (err) {
		const { statusCode, headers, trailers, body } = await request(
			`https://adventofcode.com/${year}rgregregre/day/${day}/input`,
			{
				headers: {
					cookie: `session=${process.env.COOKIE_HASH}`,
				},
			}
		);

		// get input / error message
		const data = await body.text();

		// if success
		if (statusCode == 200) {
			//  write to appropriate directory, then return input
			writeFileSync(`${fullPath}/input.txt`, data);
			return data;
		} else {
			return Error(
				`\nStatus code: ${statusCode}\nData: ${
					data.includes('404')
						? 'No input available yet for day 5! Wait until 05:00AM.\n'
						: data
				}`
			);
		}
	}
}

module.exports = { fetchInput };
