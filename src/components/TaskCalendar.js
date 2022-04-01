import React from 'react';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';

export function TaskCalendar({
  setShowCalendarOverlay,
  showCalendarOverlay,
  setTaskDate,
  setTaskStartDate,
  setTaskEndDate,
}) {
  const [date, setDate] = React.useState();
  const [focused, setFocused] = React.useState();
  return (
    showCalendarOverlay && (
      <div className="task__calendar">
        <SingleDatePicker
          date={date}
          onDateChange={(date) => {
            setTaskDate(date.format('YYYY-MM-DD'));
          }}
          focused={focused}
          onFocusChange={({ focused }) => setFocused(focused)}
          id="date"
        />
        {/* input to enter start time */}
        <input
          type="text"
          placeholder="Start Time"
          onChange={(e) => {
            setTaskStartDate(moment(e.target.value));
          }}
        />
        {/* input to enter end time */}
        <input
          type="text"
          placeholder="End Time"
          onChange={(e) => {
            setTaskEndDate(moment(e.target.value));
          }}
        />
      </div>
    )
  );
}
