import { useState, useEffect } from 'react';
import { firebase } from '../firebase';
import { collatedTasks } from '../helpers';
import moment from 'moment';

export const useTasks = (selectedTrack) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let unsubscribe = firebase
      .firestore()
      .collection('tasks')
      .where('userId', '==', '1337');

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
        selectedProject === 'NEXT_7'
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

export const useTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('tracks').where('userId', '==', '1337')
    .orderBy('trackId')
    .get()
    .then(snapshot => {
        const allTracks = snapshot.docs.map(track => ({
            ...track.data(),
            docId: track.id
        }));

        // this keeps the useEffect from running infinitely.
        if (JSON.stringify(allTracks) !== JSON.stringify(tracks)) {
            setTracks(allTracks);
        }
    });
  }, [tracks]);

  return tracks;
};
