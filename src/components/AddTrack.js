import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { generatePushId } from '../helpers';
import { useTracksValue } from '../context/tracks-context';

export const AddTrack = ({ shouldShow = false }) => {
  const [show, setShow] = useState(shouldShow);
  const [trackName, setTrackName] = useState('');

  const trackId = generatePushId();
  const { tracks, setTracks } = useTracksValue();

  const addTrack = () => {
    let firebaseUserId = '1337';
    trackName &&
      db
        .collection('tracks')
        .add({
          trackId,
          name: trackName,
          userId: firebaseUserId,
        })
        .then(() => {
          tracks.push({
            trackId,
            name: trackName,
            userId: firebaseUserId,
          });
          setTracks([...tracks]);
          setTrackName('');
          setShow(false);
        });
  };
  return (
    <div className="add-track" data-testid="add-track">
      {show && (
        <div className="add-track__input">
          <input
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            className="add-trck__name"
            data-testid="track-name"
            type="text"
            placeholder="Name your track"
          />
          <button
            className="add-track__submit"
            type="button"
            onClick={() => addTrack()}
            data-testid="add-track-submit"
          >
            Add Track
          </button>
          <span
            data-testid="hide-track-overlay"
            className="add-track__cancel"
            onClick={() => setShow(false)}
          >
            Cancel
          </span>
        </div>
      )}
      <span className="add-track__plus">+</span>
      <span
        data-testid="add-track-action"
        className="add-track__text"
        onClick={() => setShow(!show)}
      >
        {' '}
        Add Track{' '}
      </span>
    </div>
  );
};
