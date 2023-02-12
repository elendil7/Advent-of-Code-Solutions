const { createStruct } = require('./utils/main/createStruct');
const { fetchInput } = require('./API/fetchInput');

const run = new Promise(async (res, rej) => {
	try {
		// creature directory structure
		await createStruct(3, 2015);
		// fetch input from adventofcode.com
		await fetchInput(3, 2015);

		return res(`All operations sucessfully completed\n`);
	} catch (err) {
		return rej(`\n\nError: ${err}\n\n`);
	}
}).then((output) => {
	console.error(output);
});

run;
