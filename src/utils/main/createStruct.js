const { join } = require('path');
const { getFullPaths } = require('./getFullPaths');
const { readdirSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { getDay } = require('../misc/getDay');

async function createStruct() {
	// get & create path strings
	const paths = await getFullPaths();
	const yearPath = paths[0];

	const source = join(
		__dirname,
		'../../../lib/templates/task_boilerplate.js'
	);

	// make YEAR dir if does not exist
	try {
		readdirSync(yearPath);
	} catch (err) {
		mkdirSync(yearPath);
	}

	// get current day
	const day = await getDay();
	// get template.js file contents
	const template = readFileSync(source, 'utf-8');

	// only create directories after the current task day (to avoid overwriting)
	for (let nextDay = day + 1; nextDay <= 25; ++nextDay) {
		// get full nextDay path, then get destination for said path
		const nextDayPath = `${yearPath}/${nextDay}`;
		const destination = `${nextDayPath}/index.js`;

		// make next DAY dir if does not exist
		try {
			readdirSync(nextDayPath);
		} catch (err) {
			mkdirSync(nextDayPath);
		}

		// write template js files to each directory, with proper formatting
		writeFileSync(destination, template);
	}
}

module.exports = { createStruct };
