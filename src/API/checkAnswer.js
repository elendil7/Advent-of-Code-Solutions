require('dotenv').config();
const { getDay, getYear } = require('../utils/misc/getDate');
const { getFullPaths } = require('../utils/main/getFullPaths');
const { request } = require('undici');
const { parse } = require('node-html-parser');

const checkAnswer = async (answer) => {
	const day = await getDay();
	const year = await getYear();
	const fullPaths = await getFullPaths();
	console.log(fullPaths);

	try {
		const { statusCode, headers, trailers, body } = await request(
			` https://adventofcode.com/${year}/day/${day}/answer`,
			{
				headers: {
					cookie: `session=${process.env.COOKIE_HASH}`,
				},
			}
		);

		// get input / error message
		const data = await body.text();

		console.log(await parse(data));

		// if success
		if (statusCode == 200) {
			// parse input, and return it
			const parsed = parse(data);
			const answer = parsed.article.text.lower().split(';')[0];
			return parsed;
		} else {
			return Error(
				`\nStatus code: ${statusCode}\nData: ${
					data.includes(statusCode)
						? 'Answer page not yet ready. Wait until 05:00AM.\n'
						: data
				}`
			);
		}
	} catch (err) {
		console.error(`\nAPI request failed...\nError: ${err}`);
	}
};

module.exports = { checkAnswer };
