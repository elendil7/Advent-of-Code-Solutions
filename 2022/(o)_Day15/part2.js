// libraries & modules
const { readFileSync, readdirSync, writeFileSync, mkdirSync } = require('fs');
const { sleep } = require('../../src/utils/misc/sleep');
const { convert } = require('convert');
const { fetchInput } = require('../../src/API/fetchInput');
const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const {
	initializeInputExtractionTools,
} = require('../../src/utils/main/extractInput');
const { initializeTools, tools } = require('../../src/utils/main/usefulTools');

const start = async () => {
	initializeTools();
	initializeInputExtractionTools();
	const data = await fetchInput();
	//console.time('Execution time');
	await (data instanceof Error ? console.error(data.message) : task(data));
	//console.timeEnd('Execution time');
};
start();

async function task(input) {}
