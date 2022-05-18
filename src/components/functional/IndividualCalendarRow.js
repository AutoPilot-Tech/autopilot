import React from "react";

function generateKey() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
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
    <div className="sticky w-10 -ml-14 left-0 -mt-2.5 text-right text-xs leading-5 text-gray-400 sm:-ml-14 sm:pr-2 sm:w-14">
      {timeString}
    </div>
  );
}
