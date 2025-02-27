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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export const formatDate = (date: Date) => {
  return dateFormatter.format(date);
};

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

export const formatTimeString = (date: Date) => {
  return timeFormatter.format(date);
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDateTime = (date: Date) => {
  return dateTimeFormatter.format(date);
};
