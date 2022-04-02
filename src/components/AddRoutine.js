import React, { useEffect, useState } from 'react';
import { generatePushId } from '../helpers';
import { db, auth } from '../firebase';
import { useTracksValue } from '../context/tracks-context';
import { amplitude } from '../utilities/amplitude';

export const AddRoutine = ({ shouldShow = false }) => {
  const [show, setShow] = useState(shouldShow);
  const [trackName, setTrackName] = useState('');
  const [user, setUser] = useState(null);
  const [recurring, setRecurring] = useState(false);

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // this is the user's id
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const trackId = generatePushId();
  const { tracks, setTracks } = useTracksValue();

  const logClick = () => {
    amplitude.getInstance().logEvent('sideBarAddRoutineClick');
  };

  const addRoutine = () => {
    trackName &&
      db
        .collection('tracks')
        .add({
          trackId,
          name: trackName,
          userId: user,
          routine: true,
        })
        .then(() => {
          tracks.push({
            trackId,
            name: trackName,
            userId: user,
            routine: true,
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
            onClick={() => {
              addRoutine();
              logClick();
            }}
            data-testid="add-track-submit"
          >
            Add Routine
          </button>
          {/* checkbox with label */}
          <label className="add-track__recurring">
            <input
              type="checkbox"
              checked={recurring}
              onChange={() => setRecurring(!recurring)}
              className="add-track__recurring-input"
            />
            <span className="add-track__recurring-label">Recurring?</span>
          </label>

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
        Add Routine{' '}
      </span>
    </div>
  );
};
