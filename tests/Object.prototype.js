const { initializeTools, tools } = require('../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	test();
};
start();

function test() {
	let firstObject = {
		Jack: [3, 56, 7],
		David: [13],
		William: [100],
		Spongebob: [390],
		Dog: [7],
		Cat: [19],
		Tiger: [1],
		Wolf: [60],
		Lion: [210],
	};
	let secondObj = { 4: 'strength' };

	console.log(firstObject.sortLowToHigh());
	console.log(firstObject.sortHighToLow());
	console.log(firstObject.sortByValues());
	console.log(tools.populateArray(100, 130));

	for (let key in firstObject) {
		if (!firstObject.hasOwnProperty(key)) continue;

		const nums = firstObject[key];

		console.log(`\nKey: `, key);
		console.log(`Nums: `, nums);

		for (let i = 0; i < nums.length; i++) {
			console.log(nums[i]);
		}
	}

	for (const [key, val] of Object.entries(firstObject)) {
		console.log(key, val);
	}
}
