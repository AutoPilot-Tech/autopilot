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

  if (collatedTasksExist(selectedTrack) && selectedTrack) {
    trackName = getCollatedTitle(collatedTasks, selectedTrack);
  }

  if (
    tracks &&
    tracks.length > 0 &&
    selectedTrack &&
    !collatedTasksExist(selectedTrack)
  ) {
    trackName = getTitle(tracks, selectedTrack);
  }

  useEffect(() => {
    document.title = `${trackName}: Autopilot`;
  }, []);
  console.log('tasks', tasks);
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
