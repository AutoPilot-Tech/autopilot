import React, { useState } from 'react';
import { FaRegListAlt, FaRegCalendarAlt } from 'react-icons/fa';
import moment from 'moment';
import { db } from '../firebase';
import { useTracksValue } from '../context/tracks-context';

export const AddTask = ({
  showAddTaskMain = true,
  shouldShowMain = false,
  showQuickAddTask,
  setShowQuickAddTask,
}) => {
  const [task, setTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [track, setTrack] = useState('');
  const [showMain, setShowMain] = useState(shouldShowMain);
  const [showTrackOverlay, setShowTrackOverlay] = useState(false);
  const [showTaskDate, setShowTaskDate] = useState(false);

  const { selectedTrack } = useTracksValue();

  const AddTask = ({
    showAddTaskMain = true,
    shouldShowMain = false,
    showQuickAddTask,
    setShowQuickAddTask,
  }) => {
    const trackId = track || selectedTrack;
    let collatedDate = '';

    if (trackId === 'TODAY') {
      collatedDate = moment().format('DD/MM/YYYY');
    } else if (trackId === 'NEXT_7') {
      collatedDate = moment().add(7, 'days').format('DD/MM/YYYY');
    }
    return (
      task &&
      trackId &&
      db
        .collection('tasks')
        .add({
          archived: false,
          trackId,
          task,
          date: collatedDate || taskDate,
          userId: '1337',
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
          <span className="add-task__text">Add Task</span>
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
          <p>Track Overlay here</p>
          <p>TaskDate here</p>
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
            onClick={() => AddTask()}
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