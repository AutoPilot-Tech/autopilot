import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collatedTasksExist } from '../helpers';
import moment from 'moment';
import { sortedObject } from '../helpers';
import { useTracksValue } from '../context/tracks-context';

// this is constantly getting new tracks
export const useTasks = (selectedTrack) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log('first useEffect in useTasks');
    let unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('user verified in useTasks', user);
        // this is the user's id
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('second useEffect in useTasks');
    let unsubscribe = db.collection('tasks').where('userId', '==', user);

    unsubscribe =
      selectedTrack && !collatedTasksExist(selectedTrack)
        ? (unsubscribe = unsubscribe.where('trackId', '==', selectedTrack))
        : selectedTrack === 'TODAY'
        ? (unsubscribe = unsubscribe.where(
            'date',
            '==',
            moment().format('DD/MM/YYYY')
          ))
        : selectedTrack === 'INBOX' || selectedTrack === 0
        ? (unsubscribe = unsubscribe.where('date', '==', ''))
        : unsubscribe;

    unsubscribe = unsubscribe.onSnapshot((snapshot) => {
      const newTasks = snapshot.docs.map((task) => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(
        selectedTrack === 'NEXT_7'
          ? newTasks.filter(
              (task) =>
                moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
                task.archived !== true
            )
          : newTasks.filter((task) => task.archived !== true)
      );

      // Set all tasks that are archived
      setArchivedTasks(newTasks.filter((task) => task.archived !== false));
    });
    // don't want to be checking for tracks all the time, only when there is a new
    // track
    return () => unsubscribe();
  }, [selectedTrack]);

  return { tasks, archivedTasks };
};

// this one will be pulling tracks only once, and only changes
// when there is new tracks
export const useTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('first useEffect in useTracks');
    let unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('verified user from useTracks');
        // this is the user's id
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('second useEffect in useTracks');
    db.collection('tracks')
      .where('userId', '==', user)
      .orderBy('trackId')
      // this required an index in firebase
      .get()
      .then((snapshot) => {
        const allTracks = snapshot.docs.map((track) => ({
          ...track.data(),
          docId: track.id,
        }));

        // firebase is weird about giving us the same order fields in objects, so we
        // need to sort it first.

        let sortedTracks = [];
        let sortedAllTracks = [];

        // go through allTracks and sort them
        for (let i = 0; i < allTracks.length; i++) {
          sortedTracks.push(sortedObject(allTracks[i]));
        }

        // go through tracks and sort them

        for (let i = 0; i < tracks.length; i++) {
          sortedAllTracks.push(sortedObject(tracks[i]));
        }

        // this keeps the useEffect from running infinitely.
        if (JSON.stringify(sortedAllTracks) !== JSON.stringify(sortedTracks)) {
          setTracks(allTracks);
        }
      });
  }, [tracks]);

  return { tracks, setTracks };
};
