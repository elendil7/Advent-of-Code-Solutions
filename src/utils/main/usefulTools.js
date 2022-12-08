// define tools object
const tools = {};

// initializeTools function may be called in any file, to immediately make available all Array.prototype & String.prototype methods globally.
// However note that tools must be manually imported into each file respectively.
const initializeTools = () => {
	/* 
		Documentation:
			- Object.defineProperty: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
		
		Forums:
			-  Create custom Array.prototype methods: https://stackoverflow.com/questions/948358/adding-custom-functions-into-array-prototype
			- Enable custom methods on startup (require): https://stackoverflow.com/questions/5739740/extending-array-prototype-in-node-js-from-a-required-file
			- See JavaScript in-built method source code!: https://stackoverflow.com/questions/30175460/is-there-any-way-to-see-javascript-default-methods-source-code

		Enable hints (intellisense) for custom functions in VSCode??
		Forums:
			- For JS (no one knows): https://stackoverflow.com/questions/60239312/object-prototype-hints-in-vs-code
			- For PHP (there is an intellisense extension): https://stackoverflow.com/questions/42867651/parameter-suggestion-for-custom-functions-in-visual-studio-code
			- How to document prototype methods: https://stackoverflow.com/questions/27343152/jsdoc-how-to-document-prototype-methods
		
		Write custom code snippets:
			- https://stackoverflow.com/questions/63785746/how-do-you-create-a-single-custom-intellisense-feature-in-vscode
			- Tool for doing so: https://snippet-generator.app/
	*/

	// * Array.prototype custom methods
	/**
	 * @memberof Array.prototype
	 * @returns {Number}
	 * @typedef
	 */
	Array.prototype.getSmallestNum = function () {
		return Math.min(...this);
	};
	Array.prototype.getBiggestNum = function () {
		return Math.max(...this);
	};
	Array.prototype.removeDuplicates = function () {
		return [...new Set(this)];
	};
	Array.prototype.isArrayNotEmpty = function () {
		return Array.isArray(this) && Object.keys(this).length > 0;
	};
	Array.prototype.getSum = function () {
		return this.reduce((a, b) => +a + +b, 0);
	};
	Array.prototype.getAverage = function () {
		return this.reduce((a, b) => +a + +b, 0) / this.length;
	};
	Array.prototype.sortLowToHigh = function () {
		return this.sort((a, b) => +a - +b);
	};
	Array.prototype.sortHighToLow = function () {
		return this.sort((a, b) => +b - +a);
	};
	Array.prototype.getFirstNElements = function (n) {
		return this.slice(0, Math.abs(n));
	};
	Array.prototype.getLastNElements = function (n) {
		return this.slice(-n);
	};
	Array.prototype.removeAllEmptyValues = function () {
		return this.filter((v) => v);
	};
	Array.prototype.getCountOfEachElement = function () {
		const counts = {};
		for (const num of this) {
			counts[num] = counts[num] ? counts[num] + 1 : 1;
		}
		return counts;
	};

	// * String.prototype custom methods
	String.prototype.removeDuplicates = function () {
		return [...new Set(this)].join('');
	};
	String.prototype.removeWhitespace = function () {
		return this.replace(/\s/g, '');
	};
	String.prototype.reverseString = function () {
		return [...this].reverse().join('');
	};
	String.prototype.getSubstring = function (first, second) {
		const start = String(first);
		const end = String(second);
		return this.split(start).pop().split(end)[0];
	};
	String.prototype.getAllSubstrings = function (first, second) {
		const start = String(first);
		const end = String(second);
		let dels = [];
		let res = [];
		for (let i = 0; i < this.length; i++) {
			if (this[i] == start) {
				dels.push(i);
			} else if (this[i] == end && dels.length > 0) {
				let pos = dels[dels.length - 1];
				dels.pop();
				let len = i - 1 - pos;
				let ans;
				if (pos < len) {
					ans = this.substring(pos + 1, len + 1);
				} else {
					ans = this.substring(pos + 1, len + pos + 1);
				}
				res.push(ans);
			}
		}
		return res;
	};

	// * Object.prototype custom methods
	Object.prototype.sortLowToHigh = function () {
		let sortable = [];
		for (let key in this) {
			if (!ObjectPrototypes.includes(key)) {
				sortable.push([key, this[key]]);
			}
		}
		sortable.sort((a, b) => a[1] - b[1]);
		return sortable;
	};
	Object.prototype.sortHighToLow = function () {
		let sortable = [];
		for (let key in this) {
			if (!ObjectPrototypes.includes(key)) {
				sortable.push([key, this[key]]);
			}
		}
		sortable.sort((a, b) => b[1] - a[1]);
		return sortable;
	};
	Object.prototype.sortByValues = function () {
		return Object.values(this).sort((a, b) => a - b);
	};

	// * Add custom method to tools object.
	Object.defineProperty(tools, 'populateArray', {
		value: function (start, end) {
			const min = Math.min(start, end);
			const max = Math.max(start, end);
			return [...Array(Math.abs(max - min + 1))].map((v, i) => min + i);
		},
	});

	// * Make variables (after all custom methods declared - important!)
	// arrays for storing every type of prototype method relating to String, Array, and Object respectively.
	const ObjectPrototypes = Object.getOwnPropertyNames(Object.prototype);
	const ArrayPrototypes = Object.getOwnPropertyNames(Array.prototype);
	const StringPrototypes = Object.getOwnPropertyNames(String.prototype);
};

module.exports = {
	initializeTools,
	tools,
};
