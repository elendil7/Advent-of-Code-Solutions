const { join } = require('path');
const { getFullPaths } = require('./getFullPaths');
const { readdirSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { getDay, getYear } = require('../misc/getDate');
const { config } = require('../../../config.js');

async function createStruct() {
	// get current day & year
	const day = await getDay();
	const year = await getYear();
	// get alphabet
	const alphabet = '.abcdefghijklmnopqrstuvwxyz';

	// get next day number
	const nextDayNum = day + 1;

	// check if day & year is within bounds before proceeding
	if (
		nextDayNum >= config.minDay &&
		nextDayNum <= config.maxDay &&
		year >= config.minYear
	) {
		// get & create path strings
		const paths = await getFullPaths();
		const yearPath = paths[0];

		const source = join(
			__dirname,
			'../../../lib/templates/task_boilerplate.js'
		);

		// get template.js file contents
		const template = readFileSync(source, 'utf-8');

		// only create directories after the current task day (to avoid overwriting completed tasks on previous days)
		for (
			let nextDay = nextDayNum;
			nextDay <= nextDayNum && nextDay <= config.maxDay;
			++nextDay
		) {
			// get full nextDay path, then get destination for said path
			const nextDayPath = `${yearPath}/(${alphabet[nextDay]})_Day${nextDay}`;
			const destination = `${nextDayPath}/index.js`;

			console.log(nextDayPath);
			console.log(destination);

			// make next DAY dir if does not exist
			try {
				readdirSync(nextDayPath);
			} catch (err) {
				mkdirSync(nextDayPath);
			}

			// write template js files to each directory, with proper formatting
			writeFileSync(destination, template);
		}

		console.log(
			`\nDirectories in year ${year} for days ${nextDayNum}-${config.maxDay} successfully created.\n`
		);
	} else {
		console.error('\nDays or years out of bound. Change config.\n');
	}
}

module.exports = { createStruct };
