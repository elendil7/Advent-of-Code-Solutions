const { initializeTools } = require('../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	test();
};
start();

function test() {
	let smallArr = [1, 2, 3, 4, 5];
	let mediumArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	let bigArr = [
		1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	];

	console.log(smallArr.getSmallestNum());
	console.log(smallArr.getBiggestNum());
}
