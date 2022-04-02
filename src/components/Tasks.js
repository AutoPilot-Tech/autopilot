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

// this just gets the tasks and renders them
export const Tasks = () => {
  const { tracks, selectedTrack } = useTracksValue();
  let { tasks } = useTasks(selectedTrack);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isRoutine, setIsRoutine] = useState(false);

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

  // When selectedTrack changes, we want to check to see if it's the calendar
  useEffect(() => {
    if (selectedTrack === 'NEXT_7') {
      setShowCalendar(true);
      setShowChat(false);
    } else if (selectedTrack === 'ASSISTANT') {
      setShowChat(true);
    } else {
      setShowCalendar(false);
      setShowChat
    }
  }, [selectedTrack])

  // We want to check if the selected track is a routine, then change the state
  

  useEffect(() => {
    // BUG: We are not getting the correct trackName. Maybe it needs to be in a useEffect?
    // This shows the selected track in the tab on the browser
    document.title = `${trackName}: Autopilot`;
  }, []);

  // if setCalendar is true, then we will show the calendar

  return (
    <div>
      { showCalendar ? <Calendar /> : (
        <div className="tasks" data-testid="tasks">
        <h2 data-test-id="track-name">{trackName}</h2><ul className="tasks__list">
          {tasks.map(task => (
            <li key={`${task.id}`}>
              <Checkbox id={task.id} />
              <span>{task.task}</span>
            </li>
          ))}
        </ul><AddTask />
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
