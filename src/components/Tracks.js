import React, { useState } from 'react';
import { useTracksValue } from '../context/tracks-context';
import { IndividualTrack } from './IndividualTrack';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const Tracks = ({active, setActive}) => {
  const { tracks, setSelectedTrack, isRoutine, setIsRoutine} = useTracksValue();
  return (
    <div className="space-y-1">
        {tracks &&
        // filter out tracks that are true routine
        tracks.filter((track) => !track.routine).map((track) => (
        
      <li
        key={track.trackId}
        data-doc-id={track.docId}
        data-testid="track-action"
        className={classNames(active === track.trackId ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
        'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer')
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
