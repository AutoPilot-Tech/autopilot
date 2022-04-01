import React from 'react';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

export function TaskCalendar({
  setShowCalendarOverlay,
  showCalendarOverlay,
  setTaskDate,
  setTaskStartDate,
  setTaskEndDate
}) {
  const [date, setDate] = React.useState();
  const [focused, setFocused] = React.useState();
  return (
    showCalendarOverlay && (
      <div className="task__calendar">
        <SingleDatePicker
          date={date}
          onDateChange={(date) => {
            console.log(date.format('DD/MM/YYYY'));
            setTaskDate(date.format('DD/MM/YYYY'))}}

          focused={focused}
          onFocusChange={({ focused }) => setFocused(focused)}
          id="date"
        />
      </div>
    )
  );
}
