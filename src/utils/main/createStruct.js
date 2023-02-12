const { join } = require('path');
const { getFullPaths } = require('./getFullPaths');
const { readdirSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { getDay, getYear } = require('../misc/getDate');
const { config } = require('../../../config.js');

async function createStruct(day, year) {
	// get current day & year
	if (!day) day = await getDay();
	if (!year) year = await getYear();
	// get alphabet
	const alphabet = '.abcdefghijklmnopqrstuvwxyz';

	// check if day & year is within bounds before proceeding
	if (
		day >= config.minDay &&
		day <= config.maxDay &&
		year >= config.minYear
	) {
		// get & create path strings
		const paths = await getFullPaths(day, year);
		const yearPath = paths[0];

		// make YEAR dir if does not exist
		try {
			readdirSync(yearPath);
		} catch (err) {
			mkdirSync(yearPath);
		}

		const source = join(
			__dirname,
			'../../../lib/templates/task_boilerplate.js'
		);

		// get template.js file contents
		let template = readFileSync(source, 'utf-8');

		// only create directories after the current task day (to avoid overwriting completed tasks on previous days)
		for (let curDay = day; curDay <= day; ++curDay) {
			// get full curDay path, then get destination for said path
			const curDayPath = `${yearPath}/(${alphabet[curDay]})_Day${curDay}`;
			const destinationPt1 = `${curDayPath}/part1.js`;
			const destinationPt2 = `${curDayPath}/part2.js`;

			console.log(
				`\nPart 1 path: ${destinationPt1}\nPart 2 path: ${destinationPt2}`
			);

			// make next DAY dir if does not exist
			try {
				readdirSync(curDayPath);
			} catch (err) {
				mkdirSync(curDayPath);

				// create custom file using template contents with day & year (only first match - global flag not required)
				const customFile = template.replace(
					/const data = await fetchInput\(\)/g,
					`const data = await fetchInput(${day}, ${year})`
				);

				// write template js files to each directory, with proper formatting (only if the path did not exist)
				writeFileSync(destinationPt1, customFile);
				writeFileSync(destinationPt2, customFile);
			}
		}

		console.log(
			`\nDirectories in year ${year} for days ${day} successfully created.\n`
		);
	} else {
		console.error('\nDays or years out of bound. Change config.\n');
	}
}

module.exports = { createStruct };
