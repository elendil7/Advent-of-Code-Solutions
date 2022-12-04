const { join } = require('path');
const { getDay, getYear } = require('../misc/getDate');

async function getFullPaths() {
	const day = await getDay();
	const year = await getYear();

	// all stems from here. Tread carefully - hierarchy of project files must remain consistent else the program will break.
	const yearPath = join(__dirname, `../../../${year}`);
	const fullPath = `${yearPath}/${day}`;

	// returns dayPath, yearPath, fullPath
	return [yearPath, fullPath];
}

module.exports = { getFullPaths };
