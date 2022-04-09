import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Checkbox } from './Checkbox';
import { useTasks } from '../hooks';
import { collatedTasks } from '../constants';
import { getTitle, getCollatedTitle, collatedTasksExist } from '../helpers';
import { useTracksValue } from '../context/tracks-context';
import { AddTask } from './AddTask';
import { auth } from '../firebase';
import { Calendar } from '../../src/components/Calendar';
import { getRoutines } from '../helpers';
import { findRoutine } from '../helpers';
import { RoutineSettings } from './RoutineSettings';
import { FaTrashAlt } from 'react-icons/fa';
import { db } from '../firebase';

// this just gets the tasks and renders them
export const Tasks = () => {
  const { tracks, selectedTrack, isRoutine, setIsRoutine } = useTracksValue();
  let { tasks } = useTasks(selectedTrack);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
 
  let trackName = '';

  if (collatedTasksExist(selectedTrack) && selectedTrack) {
    // if the selected track is a collated track (i.e. TODAY, NEXT_7, etc)
    trackName = getCollatedTitle(collatedTasks, selectedTrack);
    // if the collated track is NEXT_7, then we will show a calendar
  }

  if (
    // if the selected track is not a collated track (i.e. a specific track)
    tracks &&
    tracks.length > 0 &&
    selectedTrack &&
    !collatedTasksExist(selectedTrack)
  ) {
    trackName = getTitle(tracks, selectedTrack);
  }

  const deleteTask = (docId) => {
    db.collection('tasks')
      .doc(docId)
      .delete()
      .then(() => {
        console.log('task deleted');
      });
  };

  // When selectedTrack changes, we want to check to see if it's the calendar
  useEffect(() => {
    if (selectedTrack === 'NEXT_7') {
      setShowCalendar(true);
      setShowChat(false);
    } else if (selectedTrack === 'ASSISTANT') {
      // this is for the future.
      setShowChat(true);
    } else {
      setShowCalendar(false);
      setShowChat;
    }
    console.log('isRoutine', isRoutine);
  }, [selectedTrack]);

  useEffect(() => {
    document.title = `Autopilot: ${trackName}`;
  }, [trackName]);

  

  // if setCalendar is true, then we will show the calendar

  return (
    <div>
      {showCalendar ? (
        <Calendar />
      ) : (
        <div className="tasks" data-testid="tasks">
          
          <h2 data-test-id="track-name">{trackName}</h2>
          {isRoutine ? <RoutineSettings /> : <></>}

          <ul className="tasks__list">
            {tasks.map((task) => (
              <li key={`${task.id}`}>
                <Checkbox
                  id={task.id}
                  
                />
                <span>{task.task}</span>
                {/* <span
                  className="tasks__task-delete"
                  onKeyDown={() => setShowConfirm(!showConfirm)}
                  onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <FaTrashAlt />
                    {showConfirm && (
                      <div className="task-delete-modal">
                        <div className="task-delete-modal__inner">
                          <p>
                            Are you sure you want to delete this task? This cannot be
                            undone.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              deleteTask(task.id);
                            }}
                          >
                            Delete
                          </button>
                          <span onClick={() => setShowConfirm(!showConfirm)}>Cancel</span>
                        </div>
                      </div>
                    )}
                  </span> */}
              </li>
            ))}
          </ul>
          <AddTask />
          
        </div>
        
      )}
    </div>
  );
  //     <h2 data-testid="track-name">{trackName}</h2>

  //     <ul className="tasks__list">
  //       {tasks.map((task) => (
  //         <li key={`${task.id}`}>
  //           <Checkbox id={task.id} />
  //           <span>{task.task}</span>
  //         </li>
  //       ))}
  //     </ul>
  //     <AddTask />
  //   </div>
  // );
};
