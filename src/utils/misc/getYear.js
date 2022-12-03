const getYear = async () => {
	const today = new Date();
	const year = today.getFullYear();
	return year;
};

module.exports = { getYear };
