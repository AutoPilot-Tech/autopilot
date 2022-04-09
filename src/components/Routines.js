import React, { useState } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { IndividualTrack } from './IndividualTrack';

export const Routines = ({ active, setActive}) => {
  // TODO: check the setSelectedTrack, make sure it's updating at the right time, becuause it's not updating
  const { tracks, setSelectedTrack, isRoutine, setIsRoutine} = useTracksValue();
  // filter out tracks that are false routine
  const routines = tracks.filter((track) => track.routine);
  // BUG: Active state needs to go up a level, axtually in the context
  
  return (
    <div>
      {routines &&
        routines.map((routine) => (
          <li
            key={routine.trackId}
            data-doc-id={routine.docId}
            data-testid="track-action"
            className={
              active === routine.trackId
                ? 'active sidebar__track'
                : 'sidebar__track'
            }
            onKeyDown={() => {
              setActive(routine.trackId);
              setSelectedTrack(routine.trackId);
            }}
            onClick={() => {
              setActive(routine.trackId);
              setSelectedTrack(routine.trackId);
              setIsRoutine(true);
            }}
          >
            <IndividualTrack track={routine} />
          </li>
        ))}
    </div>
  );
};
