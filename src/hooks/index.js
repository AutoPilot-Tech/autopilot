import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collatedTasksExist } from '../helpers';
import moment from 'moment';
import { sortedObject } from '../helpers';
import { useTracksValue } from '../context/tracks-context';

// AutoFill Algorithm
// Iteration 1: Random Fill
export const useAutoFill = (events) => {
  const [autoEvents, setAutoEvents] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // get the events with today's start date formatted YYYY-MM-DD
    const todayEvents = events.filter((event) => {
      return (
        moment(event.startDate).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
      );
    });

    // The total amount of time that the user has in their daily schedule
    const scheduleArray = Array(288).fill(null);

    // go through today's events and get the gridRow for each event
    todayEvents.forEach((event) => {
      const startGridRow = event.gridRow;
      const endGridRow = event.gridRow + (event.span - 1);
      for (let i = startGridRow - 1; i <= endGridRow; i++) {
        scheduleArray[i] = 1;
      }
    });

    console.log(scheduleArray);
  }, []);
};

// this is constantly getting new events for the calendar
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  // listen for changes to tasks collection in firebase
  useEffect(() => {
    let userId = auth.currentUser.uid;
    // when there is a new document in collection
    let unsubscribe = db.collection('events').where('userId', '==', userId);
    // set events with tasks
    unsubscribe = unsubscribe.onSnapshot((snapshot) => {
      const newEvents = snapshot.docs.map((event) => ({
        id: event.id,
        ...event.data(),
      }));
      setEvents(newEvents);
    });
    return () => unsubscribe();
  }, []);
  return { events, setEvents };
};

// this is constantly getting new tracks
export const useTasks = (selectedTrack) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    let userId = auth.currentUser.uid;
    let unsubscribe = db.collection('tasks').where('userId', '==', userId);

    unsubscribe =
      selectedTrack && !collatedTasksExist(selectedTrack)
        ? (unsubscribe = unsubscribe.where('trackId', '==', selectedTrack))
        : selectedTrack === 'TODAY'
        ? (unsubscribe = unsubscribe.where(
            'date',
            '==',
            moment().format('YYYY-MM-DD')
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
                moment(task.date, 'YYYY-MM-DD').diff(moment(), 'days') <= 7 &&
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

export const useActive = () => {
  const [active, setActive] = useState('inbox');

  useEffect(() => {
    active = active;
  }, [active]);
};

// this one will be pulling tracks only once, and only changes
// when there is new tracks
export const useTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    let userId = auth.currentUser.uid;
    db.collection('tracks')
      .where('userId', '==', userId)
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
