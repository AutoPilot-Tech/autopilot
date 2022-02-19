import React from 'react';
import { useTracksValue } from '../context/tracks-context';

export const TrackOverlay = ({
  setTrack,
  showTrackOverlay,
  setShowTrackOverlay,
}) => {
  const { tracks } = useTracksValue();
  return (
    tracks &&
    showTrackOverlay && (
      <div className="track-overlay" data-testid="track-overlay">
        <ul className="track-overlay__list">
          {tracks.map((track) => (
            <li
              key={track.trackId}
              data-testid="track-overlay-action"
              onClick={() => {
                setTrack(track.trackId);
                setShowTrackOverlay(false);
              }}
            >
              {track.name}
            </li>
          ))}
        </ul>
      </div>
    )
  );
};
