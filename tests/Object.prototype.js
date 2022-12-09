const { initializeTools, tools } = require('../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	test();
};
start();

function test() {
	let firstObject = {
		Jack: 29,
		David: 13,
		William: 100,
		Spongebob: 390,
		Dog: 7,
		Cat: 19,
		Tiger: 1,
		Wolf: 60,
		Lion: 210,
	};

	console.log(firstObject.sortLowToHigh());
	console.log(firstObject.sortHighToLow());
	console.log(firstObject.sortByValues());
	console.log(tools.populateArray(100, 130));
}
