const { initializeTools } = require('../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	test();
};
start();

function test() {
	let regularStr = 'The quick brown fox jumped over the lazy dog';
	let mediumStr = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
	let largeStr = `The bridge spanning a 100-foot gully stood in front of him as the last obstacle blocking him from reaching his destination. While people may have called it a "bridge", the reality was it was nothing more than splintered wooden planks held together by rotting ropes. It was questionable whether it would hold the weight of a child, let alone the weight of a grown man. The problem was there was no other way across the gully, and this played into his calculations of whether or not it was worth the risk of trying to cross it.`;
	let messedUpStr =
		' the    dog ate a  939 b  r  g   a crowbar ........ (hello there)    ';
	let strWithParenthesis =
		'The quick (stealthy) brown fox jumped over the (rabid) lazy dog (swiftly).';
	let duplicateStr =
		'The quick and quick purple cat jumped over the The jumped dog quickly.....';

	console.log(regularStr.removeDuplicates());
	console.log(regularStr.removeWhitespace());
	console.log(regularStr.reverseString());
}
