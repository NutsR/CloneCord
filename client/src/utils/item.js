const months = [
	"January",
	"Febuary",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"Decmeber",
];

function createRangeOfYears() {
	const currentYear = new Date().getFullYear(),
		years = [];
	let startYear = 1870;
	while (startYear < currentYear) {
		years.push(startYear++);
	}
	return years.reverse();
}
const years = createRangeOfYears();
const days = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
	23, 24, 25, 26, 27, 28, 29, 30, 31,
];
export { months, years, days };
