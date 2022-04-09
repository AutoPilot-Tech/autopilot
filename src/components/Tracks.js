import React, { useState } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { IndividualTrack } from './IndividualTrack';

export const Tracks = ({active, setActive}) => {
  const { tracks, setSelectedTrack, isRoutine, setIsRoutine} = useTracksValue();
  return (
    <div>
        {tracks &&
        // filter out tracks that are true routine
        tracks.filter((track) => !track.routine).map((track) => (
        
      <li
        key={track.trackId}
        data-doc-id={track.docId}
        data-testid="track-action"
        className={
          active === track.trackId ? 'active sidebar__track' : 'sidebar__track'
        }
        onKeyDown={() => {
            setActive(track.trackId);
            setSelectedTrack(track.trackId);
        }}
        onClick={() => {
          setActive(track.trackId);
          setSelectedTrack(track.trackId);
          setIsRoutine(false);
        }}
      >
        <IndividualTrack track={track} />
      </li>
    
    
    ))}
    </div>

  );
};
