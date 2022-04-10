import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { generatePushId } from '../helpers';
import { useTracksValue } from '../context/tracks-context';
import { amplitude } from '../utilities/amplitude';

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
    }
    );
    return unsubscribe;
  }, []);

  const logClick = () => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent('sideBarAddTrackClick', userId);
  }

  const addTrack = () => {
    trackName &&
      db
        .collection('tracks')
        .add({
          trackId,
          name: trackName,
          userId: user,
          routine: false
        })
        .then(() => {
          tracks.push({
            trackId,
            name: trackName,
            userId: user,
            routine: false
          });
          setTracks([...tracks]);
          setTrackName('');
          setShow(false);
        });
  };
  return (
    <div className="float-right mt-3 mr-5 cursor-pointer" data-testid="add-track">
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
        className="text-gray-400 cursor-pointer pl-1 pr-1 pt-0 pb-0 hover:rounded-md hover:text-gray-900 hover:bg-gray-200 text-lg"
        onClick={() => setShow(!show)}
      >
        +
      </span>
    </div>
  );
};
