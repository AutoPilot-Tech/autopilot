import React, { useState } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { IndividualTrack } from './IndividualTrack';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Routines = ({ active, setActive}) => {
  // TODO: check the setSelectedTrack, make sure it's updating at the right time, becuause it's not updating
  const { tracks, setSelectedTrack, isRoutine, setIsRoutine} = useTracksValue();
  // filter out tracks that are false routine
  const routines = tracks.filter((track) => track.routine);
  // BUG: Active state needs to go up a level, axtually in the context
  
  return (
    <div className="space-y-1">
      {routines &&
        routines.map((routine) => (
          <li
            key={routine.trackId}
            data-doc-id={routine.docId}
            data-testid="track-action"
            className={classNames(active === routine.trackId ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer')
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
