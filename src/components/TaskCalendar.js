import React from 'react';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export function TaskCalendar({
  setShowCalendarOverlay,
  showCalendarOverlay,
}) {
  const [date, setDate] = React.useState();
  const [focused, setFocused] = React.useState();
  return (
    showCalendarOverlay && (
      <div className="task__calendar">
        <SingleDatePicker
          date={date}
          onDateChange={(date) => setDate(date)}
          focused={focused}
          onFocusChange={({ focused }) => setFocused(focused)}
          id="date"
        />
      </div>
    )
  );
}
