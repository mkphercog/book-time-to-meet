export const formatEventDescription = (durationInMinutes: number) => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const minutesString = `${minutes} ${minutes > 1 ? "mins" : "min"}`;
  const hoursString = `${hours} ${hours > 1 ? "hrs" : "hr"}`;

  if (hours === 0) return minutesString;
  if (minutes === 0) return hoursString;
  return `${hoursString} ${minutesString}`;
};

export const formatTimezoneOffset = (timeZone: string) => {
  return Intl.DateTimeFormat(undefined, {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type == "timeZoneName")?.value;
};
