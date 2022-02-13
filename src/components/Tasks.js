import React, { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Checkbox } from './Checkbox';
import { useTasks } from '../hooks';
import { collatedTasks } from '../constants';
import { getTitle, getCollatedTitle, collatedTasksExist } from '../helpers';
import { useSelectedTrackValue, useTracksValue } from '../context';

// this just gets the tasks and renders them
export const Tasks = () => {
  const { selectedTrack } = useSelectedTrackValue();
  const { tracks } = useTracksValue();
  const { tasks } = useTasks(selectedTrack);

  let trackName = '';

  if (tracks && selectedTrack && !collatedTasksExist(selectedTrack)) {
      trackName = getTitle(tracks, selectedTrack).name;
      console.log('track name 1: ', trackName);
  }

  if (collatedTasksExist(selectedTrack) && selectedTrack) {
      trackName = getCollatedTitle(collatedTasks, selectedTrack).name;
        console.log('track name 2: ', trackName);
  }

  useEffect(() => {
      document.title = `${trackName}: Autopilot`
  },[]);

  return (
    <div className="tasks" data-testid="tasks">
      <h2 data-testid="track-name">{trackName}</h2>

      <ul className="tasks__list">
        {tasks.map((task) => (
          <li key={`${task.id}`}>
            <Checkbox id={task.id} />
            <span>{task.task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
