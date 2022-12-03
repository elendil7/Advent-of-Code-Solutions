const getDay = async () => {
	const today = new Date();
	const day = today.getDate();
	return day;
};

module.exports = { getDay };
