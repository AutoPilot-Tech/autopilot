import React from "react";
import moment from 'moment';

export function SmallCalendar({showSmallCalendar, setShowSmallCalendar}) {
  return (
    <div
      className={
        !showSmallCalendar
          ? "hidden"
          : "absolute border-2 z-50 rounded-md shadow-md top-24 flex-col"
      }
    >
      <div id="month-indicator" className="flex">
        <p className="m-auto">{moment().format("MMMM YYYY")}</p>
      </div>
      <div
        id="day-of-week"
        className="text-xs grid"
        style={{
          gridTemplateColumns: `repeat(7, 1fr)`,
        }}
      >
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div id="date-grid" className="mt-1"></div>
    </div>
  );
}
