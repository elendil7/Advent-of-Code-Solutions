const { join } = require('path');

async function getFullPaths(day, year) {
	const alphabet = '.abcdefghijklmnopqrstuvwxyz';

	// all stems from here. Tread carefully - hierarchy of project files must remain consistent else the program will break.
	const yearPath = join(__dirname, `../../../${year}`);
	const fullPath = `${yearPath}/(${alphabet[day]})_Day${day}`;

	// returns dayPath, yearPath, fullPath
	return [yearPath, fullPath];
}

module.exports = { getFullPaths };
