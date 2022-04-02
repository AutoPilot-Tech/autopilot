import React, { useState } from 'react'
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import moment from 'moment';

export const RoutineSettings = () => {
    const [value, setValue] = useState('');
    const [routineStartDate, setRoutineStartDate] = useState('');
    const [routineEndDate, setRoutineEndDate] = useState('');
    const [routineRecurring, setRoutineRecurring] = useState(false);


  return (
    <div
      className="routine__settings"
    >
        <div className="routine__settings__title">
            <p>Routine Settings</p>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="Start Date"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                console.log('start date',newValue.format())
                setRoutineStartDate(newValue.format());
              }}
            />
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              label="End Date"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                console.log('end date:', newValue.format())
                setRoutineEndDate(newValue.format());
              }}
            />
            {/* set routine to recurring with a checkbox */}
            <input
                className="routine__settings__recurring"
                type="checkbox"
                value={routineRecurring}
                onChange={(e) => setRoutineRecurring(e.target.value)}
            />
            <p>Recurring Routine?</p>

        </div>

    </div>
  )
}

