const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hrs = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hrs}:${mins}`;
};

export const generateSlots = (startTimes, endTimes, slotDuration) => {
  const start = timeToMinutes(startTimes);
  const end = timeToMinutes(endTimes);

  if (start >= end) {
    throw new Error("Invalid time range");
  }

  if (slotDuration <= 0) {
    throw new Error("Invalid slot duration");
  }
  const slots = [];
  let current = start;

  while(current + slotDuration <=end) {
    slots.push(minutesToTime(current));
    current += slotDuration;
  }
  return slots;
};
