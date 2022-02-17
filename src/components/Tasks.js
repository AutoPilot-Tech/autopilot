import React, { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Checkbox } from './Checkbox';
import { useTasks } from '../hooks';
import { collatedTasks } from '../constants';
import { getTitle, getCollatedTitle, collatedTasksExist } from '../helpers';
import { useTracksValue } from '../context/tracks-context';

// this just gets the tasks and renders them
export const Tasks = () => {
  const { tracks, selectedTrack } = useTracksValue();
  const { tasks } = useTasks(selectedTrack);

  let trackName = '';

  if (collatedTasksExist(selectedTrack) && selectedTrack) {
    // if the selected track is a collated track (i.e. TODAY, NEXT_7, etc)
    trackName = getCollatedTitle(collatedTasks, selectedTrack);
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

  useEffect(() => {
    // This shows the selected track in the tab on the browser
    document.title = `${trackName}: Autopilot`;
  }, []);

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
