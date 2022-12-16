const { createStruct } = require('./utils/main/createStruct');
const { fetchInput } = require('./API/fetchInput');

const run = new Promise(async (res, rej) => {
	try {
		// creature directory structure (day, year) (no args = current date)
		await createStruct();
		// fetch input from adventofcode.com (day year) (no args = current date)
		await fetchInput();

		return res(`All operations sucessfully completed\n`);
	} catch (err) {
		return rej(`\n\nError: ${err}\n\n`);
	}
}).then((output) => {
	console.error(output);
});

run;
