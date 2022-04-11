import React, { useState } from 'react';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import { amplitude } from '../utilities/amplitude';
import { db, auth } from '../firebase';
import { useTracksValue } from '../context/tracks-context';
import { getTitle } from '../helpers/index';

export const RoutineSettings = () => {
  const [value, setValue] = useState('');
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [routineStartDate, setRoutineStartDate] = useState('');
  const [routineEndDate, setRoutineEndDate] = useState('');
  const [routineRecurring, setRoutineRecurring] = useState(false);
  const { tracks, selectedTrack } = useTracksValue();

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  };

  const routineScheduler = () => {
    let trackName = '';
    if (
      // if the selected track is not a collated track (i.e. a specific track)
      tracks &&
      tracks.length > 0 &&
      selectedTrack
    ) {
      trackName = getTitle(tracks, selectedTrack);
    }
    // calculate the duration of the event in minutes * 12 (used for span in Calendar)
    let durationInMinutes =
      moment(routineEndDate).diff(moment(routineStartDate), 'minutes');
    let durationInHoursDecimal = (durationInMinutes / 60) * 12;
    // get the start time's hour and minute'
    let startHour = moment(routineStartDate).hours();
    let startMinute = moment(routineStartDate).minutes();
    // Add two since its gridRow, and multiply by 12
    let startTimeInHoursDecimal = Math.floor( startHour + (startMinute / 60));
    let gridRowForCalendar = Math.floor(startTimeInHoursDecimal * 12) + 2;

    console.log(routineStartDate);
    console.log(routineEndDate);
    let userId = auth.currentUser.uid;
    let maintenanceRequired = false;
    db.collection('events').add({
      archived: false,
      trackId: selectedTrack,
      routineId: selectedTrack,
      title: trackName,
      start: routineStartDate.format(),
      end: routineEndDate.format(),
      userId: userId,
      maintenanceRequired: maintenanceRequired,
      gridRow: gridRowForCalendar,
      span: durationInHoursDecimal,
    });
    // schedule the routine for the next 7 days
    for (let i = 0; i < 7; i++) {
      let startTime = routineStartDate.add(1, 'days').format();
      let endTime = routineEndDate.add(1, 'days').format();
      // if its the 6th iteration or above set maintenanceRequired to true
      // we will use this to regenerate more routines on the server side - this saves space and $$
      if (i >= 6) {
        maintenanceRequired = true;
      }
      db.collection('events').add({
        archived: false,
        trackId: selectedTrack,
        routineId: selectedTrack,
        title: trackName,
        start: startTime,
        end: endTime,
        userId: userId,
        maintenanceRequired: maintenanceRequired,
        gridRow: gridRowForCalendar,
        span: durationInHoursDecimal,
      });
    }
  };

  return (
    <div className="routine__settings">
      <div className="routine__settings__title">
        <p>Routine Settings</p>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="Start Date"
          value={startValue}
          onChange={(newValue) => {
            setStartValue(newValue);
            setRoutineStartDate(newValue);
          }}
          onClick={() => {
            logClick('routineSetStartTime');
          }}
        />
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label="End Date"
          value={endValue}
          onChange={(newValue) => {
            setEndValue(newValue);
            setRoutineEndDate(newValue);
          }}
          onClick={() => {
            logClick('routineSetEndTime');
          }}
        />
        {/* set routine to recurring with a checkbox */}
        <input
          className="routine__settings__recurring"
          type="checkbox"
          value={routineRecurring}
          onChange={(e) => {
            setRoutineRecurring(e.target.value);
            routineScheduler();
          }}
        />
        <p>Recurring Routine?</p>
      </div>
    </div>
  );
};
