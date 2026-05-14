export const basqueMonths = {
  1: "urt.",
  2: "ots.",
  3: "mar.",
  4: "api.",
  5: "mai.",
  6: "eka.",
  7: "uzt.",
  8: "abu.",
  9: "ira.",
  10: "urr.",
  11: "aza.",
  12: "abe.",
};

export function formatBasqueDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${basqueMonths[month]} ${day}`;
}

export function formatBasqueDateRange(startDate, endDate) {
  if (!startDate) return "";

  if (!endDate || startDate === endDate) {
    return formatBasqueDate(startDate);
  }

  return `${formatBasqueDate(startDate)} - ${formatBasqueDate(endDate)}`;
}