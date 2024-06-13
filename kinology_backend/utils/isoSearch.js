const { isoCodes } = require("../data/isocodes");

// this binary search is used to find the ISO country code based on country's full name. Since the countries are in alphabetical order, binary search works well here.
const isoCountrySearch = (countryName) => {
  let left = 0;
  let right = isoCodes.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparisonResult = isoCodes[mid].name.localeCompare(countryName);

    if (comparisonResult === 0) {
      return isoCodes[mid].code;
    } else if (comparisonResult < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null;
};

module.exports = { isoCountrySearch };
