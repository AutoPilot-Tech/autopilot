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
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent('sideBarAddRoutineClick', userId);
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
    <div
      className="float-right mt-3 mr-5 cursor-pointer"
      data-testid="add-track"
    >
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
      <span
        className="text-gray-400 cursor-pointer hover:rounded-md hover:text-gray-900 hover:bg-gray-200 text-lg"
        onClick={() => setShow(!show)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span
        data-testid="add-track-action"
        className="add-track__text"
        onClick={() => setShow(!show)}
      ></span>
    </div>
  );
};
