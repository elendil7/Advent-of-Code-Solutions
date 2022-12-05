const initializeInputExtractionTools = () => {
	String.prototype.splitInputEveryNLines = function (lines) {
		// split by each line
		const arr = this.toString().trim().split('\n');

		// edge cases (for human error)
		if (lines === 0) return this;
		// clean lines input
		if (lines < 1) lines = Math.abs(lines);

		// define an output and a temporary array respectively.
		let clusters = [];
		let temp = [];

		// bundle up multiple lines into arrays based on the number the user passed in (split at every n lines).
		for (let i = 0; i < arr.length; ++i) {
			const cur = String(arr[i]).replace(/(\r\n|\n|\r)/gm, '');
			temp.push(cur);
			if ((i + 1) % lines == 0) {
				clusters.push(temp);
				temp = [];
			}
		}

		// return bundled up lines as 2D array
		return clusters;
	};
	String.prototype.splitInputEveryBlankLine = function () {
		const arr = this.toString().trim().split('\n');

		let clusters = [];
		let temp = [];

		for (let i = 0; i < arr.length; ++i) {
			const cur = String(arr[i]).replace(/(\r\n|\n|\r)/gm, '');
			// edge case (end of array)
			if (i + 1 === arr.length) {
				temp.push(cur);
				clusters.push(temp);
				break;
			} else if (cur == '') {
				clusters.push(temp);
				temp = [];
			} else {
				temp.push(cur);
			}
		}

		return clusters;
	};
};

module.exports = { initializeInputExtractionTools };
