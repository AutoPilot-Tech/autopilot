import React, { useState } from 'react';
import { useSelectedTrackValue, useTracksValue } from '../context';

export const Tracks = ({ activeValue = null }) => {
  const [active, setActive] = useState(activeValue);
  const { setSelectedTrack } = useSelectedTrackValue();
  const { tracks } = useTracksValue();
  console.log(tracks)
  return (
    tracks &&
    tracks.map((track) => (
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
        }}
      >
        I am a track
      </li>
    ))
  );
};