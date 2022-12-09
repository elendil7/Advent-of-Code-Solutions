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
	let arrWithDuplicates = [
		1, 2, 2, 2, 2, 4, 5, 2, 8, 9, 5, 5, 5, 3, 3, 4, 10, 9, 45, 7, 7, 7, 8,
	];
	let unsortedArr = [
		46, 32, 25, 7, 8, 2, 3, 57, 68, 22, 1, 5, 3, 2, 3, 3, 301, 2, 3, 53, 32,
		64,
	];
	let weirdArr = [null, 1, 3, 4, 23, 3, 976, 10, 37, 4, [], undefined, ''];

	console.log(smallArr.getSmallestNum());
	console.log(smallArr.getBiggestNum());
	console.log(arrWithDuplicates.removeDuplicates());
	console.log(mediumArr.isArrayNotEmpty());
	console.log(smallArr.getSum());
	console.log(smallArr.getAverage());
	console.log(unsortedArr.sortLowToHigh());
	console.log(unsortedArr.sortHighToLow());
	console.log(bigArr.getFirstNElements(5));
	console.log(bigArr.getLastNElements(5));
	console.log(weirdArr.removeAllEmptyValues());
	console.log(arrWithDuplicates.getCountOfEachElement());
}
