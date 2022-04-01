import React, { useState } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { IndividualTrack } from './IndividualTrack';

export const Routines = ({ activeValue = null }) => {
  const [active, setActive] = useState(activeValue);
  const { tracks, setSelectedTrack } = useTracksValue();

  // filter out tracks that are false routine
  const routines = tracks.filter((track) => track.routine);

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
            }}
          >
            <IndividualTrack track={routine} />
          </li>
        ))}
    </div>
  );
};
