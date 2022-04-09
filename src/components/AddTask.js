import React, { useState, useEffect } from 'react';
import { FaRegListAlt, FaRegCalendarAlt, FaRegCalendar } from 'react-icons/fa';
import moment from 'moment';
import { db, auth } from '../firebase';
import { useTracksValue } from '../context/tracks-context';
import { TrackOverlay } from './TrackOverlay';
import { TaskDate } from './TaskDate';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import { amplitude } from '../utilities/amplitude';

export const AddTask = ({
  showAddTaskMain = true,
  shouldShowMain = false,
  showQuickAddTask,
  setShowQuickAddTask,
}) => {
  const [task, setTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskStartDate, setTaskStartDate] = useState('');
  const [taskEndDate, setTaskEndDate] = useState('');
  const [track, setTrack] = useState('');
  const [showMain, setShowMain] = useState(shouldShowMain);
  const [showTrackOverlay, setShowTrackOverlay] = useState(false);
  const [showTaskDate, setShowTaskDate] = useState(false);
  const [user, setUser] = useState(null);
  // Show the second modal for setting the task date and time
  const [showTaskDateMain, setShowTaskDateMain] = useState(false);
  // Show date picker with react-dates
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);
  const [value, setValue] = useState('');
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');

  const { selectedTrack } = useTracksValue();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // this is the user's id
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  };

  const addTask = () => {
    const trackId = track || selectedTrack;
    let collatedDate = '';

    if (trackId === 'TODAY') {
      collatedDate = moment().format('YYYY-MM-DD');
    } else if (trackId === 'NEXT_7') {
      collatedDate = moment().add(7, 'days').format('YYYY-MM-DD');
    }
    return (
      task &&
      trackId &&
      db
        .collection('tasks')
        .add({
          archived: false,
          trackId: trackId,
          task: task,
          title: task,
          // need to figure out what to do with this, if its a collated
          // bc we often will be setting start times and end times
          // startDate: taskStartDate,
          // endDate: taskEndDate,
          date: collatedDate || taskDate,
          start: taskStartDate,
          end: taskEndDate,
          userId: user,
        })
        .then(() => {
          setTask('');
          setTrack('');
          setShowMain('');
          setShowTrackOverlay(false);
        })
    );
  };

  return (
    <div
      className={showQuickAddTask ? 'add-task add-task__overlay' : 'add-task'}
      data-testid="add-task-comp"
    >
      {showAddTaskMain && (
        <div
          className="add-task__shallow"
          data-testid="show-main-action"
          onClick={() => setShowMain(!showMain)}
        >
          <span className="add-task__plus">+</span>
          <span
            className="add-task__text"
            onClick={logClick('regularAddTaskClick')}
          >
            Add Task
          </span>
        </div>
      )}

      {(showMain || showQuickAddTask) && (
        <div className="add-task__main" data-testid="add-task-main">
          {showQuickAddTask && (
            <>
              <div data-testid="quick-add-task">
                <h2 className="header">Quick Add Task</h2>
                <span
                  className="add-task__cancel-x"
                  data-testid="add-task-quick-cancel"
                  onClick={() => {
                    setShowMain(false);
                    setShowTrackOverlay(false);
                    setShowQuickAddTask(false);
                  }}
                >
                  X
                </span>
              </div>
            </>
          )}
          <TrackOverlay
            setTrack={setTrack}
            showTrackOverlay={showTrackOverlay}
            setShowTrackOverlay={setShowTrackOverlay}
          />
          <TaskDate
            setTaskDate={setTaskDate}
            showTaskDate={showTaskDate}
            setShowTaskDate={setShowTaskDate}
          />

          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Start Date"
            value={startValue}
            onChange={(newValue) => {
              setStartValue(newValue);
              console.log('start date', newValue.format());
              setTaskStartDate(newValue.format());
            }}
            onClick={() => {
              logClick('taskStartDateClick');
            }}
          />
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="End Date"
            value={endValue}
            onChange={(newValue) => {
              setEndValue(newValue);
              console.log('end date:', newValue.format());
              setTaskEndDate(newValue.format());
            }}
            onClick={() => {
              logClick('taskEndDateClick');
            }}
          />

          <input
            className="add-task__content"
            data-testid="add-task-content"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            type="button"
            className="add-task__submit"
            data-testid="add-task"
            onClick={() =>
              showQuickAddTask
                ? addTask() && setShowQuickAddTask(false)
                : addTask()
            }
          >
            Add Task
          </button>
          {!showQuickAddTask && (
            <span
              className="add-task__cancel"
              data-testid="add-task-main-cancel"
              onClick={() => {
                setShowMain(false);
                setShowTrackOverlay(false);
              }}
            >
              Cancel
            </span>
          )}

          <span
            className="add-task__project"
            data-testid="show-track-overlay"
            onClick={() => {
              setShowTrackOverlay(!showTrackOverlay);
            }}
          >
            <FaRegListAlt />
          </span>
          <span
            className="add-task__date"
            data-testid="show-task-date-overlay"
            onClick={() => {
              setShowTaskDate(!showTaskDate);
            }}
          >
            <FaRegCalendarAlt />
          </span>
        </div>
      )}
    </div>
  );
};
