import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { generatePushId } from '../helpers';
import { useTracksValue } from '../context/tracks-context';
import { amplitude } from '../utilities/amplitude';
import { getRandomColor } from '../helpers/index';

export const AddTrackNew = ({ shouldShow = false }) => {
    const [trackName, setTrackName] = useState('');
    const [user, setUser] = useState(null);

    const trackId = generatePush();
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