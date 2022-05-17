import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { generatePushId } from '../helpers';
import { useTracksValue } from '../context/tracks-context';
import { amplitude } from '../utilities/amplitude';
import { getRandomColor } from '../helpers/index';

export const AddTrack = ({ shouldShow = false }) => {
  const [show, setShow] = useState(shouldShow);
  const [trackName, setTrackName] = useState('');
  const [user, setUser] = useState(null);

  const trackId = generatePushId();
  const { tracks, setTracks } = useTracksValue();

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

  const logClick = () => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent('sideBarAddTrackClick', userId);
  };

  const addTrack = () => {
    let trackColor = getRandomColor();
    trackName &&
      db
        .collection('tracks')
        .add({
          trackId,
          name: trackName,
          userId: user,
          routine: false,
          textColor: `text-${trackColor}-500`,
          bgColor: `bg-${trackColor}-50`,
        })
        .then(() => {
          tracks.push({
            trackId,
            name: trackName,
            userId: user,
            routine: false,
            color: trackColor,
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
      <span
        data-testid="add-track-action"
        className="text-gray-400 cursor-pointer  hover:rounded-md hover:text-gray-900 hover:bg-gray-200 text-lg"
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
    </div>
  );
};
