import React from "react";

export function IndividualCalendarRow({time}) {
  let adjustedTime;
  let pmOrAm;
  if (time === 0) {
    adjustedTime = 12;
    pmOrAm = "AM";
  } else if (time < 12) {
    adjustedTime = time;
    pmOrAm = "AM";
  } else if (time > 12) {
    adjustedTime = time - 12;
    pmOrAm = "PM";
  } else if (time === 12) {
    adjustedTime = 12;
    pmOrAm = "PM";
  }
  let timeString = `${adjustedTime} ${pmOrAm}`;
  return (
    <div>
      <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
        {timeString}
      </div>
    </div>
  );
}
