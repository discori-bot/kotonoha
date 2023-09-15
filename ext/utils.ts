export const minuteToDays = (minutes: number) => minutes / (60 * 24);

export const daysToMillis = (days: number) => days * (24 * 60 * 60 * 1000);

export const millisToDays = (millis: number) => millis / (1000 * 60 * 60 * 24);

export const humanFriendlyTime = (days: number) => {
  if (days === null) return days;
  if (days < 1) return `${+(days * 24 * 60).toFixed(2)} minutes`;
  if (days < 30) return `${+days.toFixed(2)} days`;
  if (days < 365) return `${+(days / (365.25 / 12)).toFixed(2)} months`;
  return `${+(days / 365.25).toFixed(2)} years`;
};
