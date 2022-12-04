const getDay = async () => {
	const today = new Date();
	const day = today.getDate();
	return day;
};

const getYear = async () => {
	const today = new Date();
	const year = today.getFullYear();
	return year;
};

module.exports = { getDay, getYear };
