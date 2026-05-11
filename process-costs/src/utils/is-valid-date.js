/* Returns true if the given year/month/day combination represents a real calendar date */
const isValidDate = (year, month, day) => {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  // Reject non-numeric inputs immediately
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (m < 1 || m > 12 || d < 1) return false;
  // Use Date object to validate the actual calendar date
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

module.exports = isValidDate;
