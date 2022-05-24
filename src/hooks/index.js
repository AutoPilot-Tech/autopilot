import {useState, useEffect} from "react";
import {db, auth} from "../firebase";
import {collatedTasksExist} from "../helpers";
import moment from "moment";
import {sortedObject, sortArrayOfObjects} from "../helpers";
import {useLoadingValue} from "../context/loading-context";

// AutoFill Algorithm ( Not a Hook)
// Iteration 1: Random Fill
export const useAutoFill = (events) => {
  // get the events with today's start date formatted YYYY-MM-DD
  const todayEvents = events.filter((event) => {
    return (
      moment(event.startDate).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
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

  let dayStart = 61;
  let dayEnd = 275;

  //

  // iterate through the scheduleArray
  for (let i = dayStart; i <= dayEnd; i++) {
    // need to check if there are 24 consecutive indices that are null then fill them with a 2
    let consecutiveNulls = 0;
    let consecutiveNullsStart = 0;
    let consecutiveNullsEnd = 0;
    for (let j = i; j <= i + 23; j++) {
      // if this is the first index that is null then set the start index
      if (j === i && scheduleArray[j] === null) {
        consecutiveNullsStart = j;
      }
      if (scheduleArray[j] === null) {
        consecutiveNulls++;
      }
    }
    if (consecutiveNulls === 24) {
      // set consecutiveNullsEnd to the last index that is null
      consecutiveNullsEnd = consecutiveNullsStart + 23;
      let randomNumber = Math.floor(Math.random() * 24);
      for (let k = i; k <= i + 23; k++) {
        scheduleArray[k] = randomNumber;
      }

      // Now make an event in firebase
      let userId = auth.currentUser.uid;
      let maintenanceRequired = false;
      db.collection("events").add({
        archived: false,
        trackId: null,
        routineId: null,
        title: null,
        start: null,
        end: null,
        userId: userId,
        maintenanceRequired: maintenanceRequired,
        gridRow: consecutiveNullsStart,
        span: 24,
      });
    }
  }
  console.log("filled in scheduleArray:", scheduleArray);
};

// this is constantly getting new events for the calendar
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  // listen for changes to tasks collection in firebase
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        let userId = auth.currentUser.uid;
        // when there is a new document in collection
        let unsubscribe = db.collection("events").where("userId", "==", userId);
        // set events with tasks
        unsubscribe = unsubscribe.onSnapshot((snapshot) => {
          const newEvents = snapshot.docs.map((event) => ({
            id: event.id,
            ...event.data(),
          }));
          setEvents(newEvents);
        });
        return () => unsubscribe();
      } else {
      }
    });
  }, []);
  return {events, setEvents};
};

// this is constantly getting new tracks
export const useTasks = (selectedTrack) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [tasksLength, setTasksLength] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        let userId = auth.currentUser.uid;
        let unsubscribe = db.collection("tasks").where("userId", "==", userId);

        unsubscribe =
          selectedTrack && !collatedTasksExist(selectedTrack)
            ? (unsubscribe = unsubscribe.where("trackId", "==", selectedTrack))
            : selectedTrack === "TODAY"
            ? (unsubscribe = unsubscribe.where(
                "date",
                "==",
                moment().format("YYYY-MM-DD")
              ))
            : selectedTrack === "INBOX" || selectedTrack === 0
            ? (unsubscribe = unsubscribe.where("date", "==", ""))
            : unsubscribe;

        unsubscribe = unsubscribe.onSnapshot((snapshot) => {
          const newTasks = snapshot.docs.map((task) => ({
            id: task.id,
            ...task.data(),
          }));

          // go through newTasks and sort them by index property
          const sortedTasksByIndex = sortArrayOfObjects(newTasks);

          setTasks(
            selectedTrack === "NEXT_7"
              ? sortedTasksByIndex.filter(
                  (task) =>
                    moment(task.date, "YYYY-MM-DD").diff(moment(), "days") <=
                      7 && task.archived !== true
                )
              : sortedTasksByIndex.filter((task) => task.archived !== true)
          );

          // Set all tasks that are archived
          setArchivedTasks(
            sortedTasksByIndex.filter((task) => task.archived !== false)
          );
          // See how many tasks are in the tasks array
          setTasksLength(newTasks.length);
        });

        // don't want to be checking for tracks all the time, only when there is a new
        // track
        return () => unsubscribe();
      } else {
      }
    });
  }, [selectedTrack]);

  return {tasks, archivedTasks, tasksLength, setTasks};
};

export const useActive = () => {
  const [active, setActive] = useState("inbox");

  useEffect(() => {
    active = active;
  }, [active]);
};

// this one will be pulling tracks only once, and only changes
// when there is new tracks
export const useTracks = () => {
  const [tracks, setTracks] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        let userId = auth.currentUser.uid;
        db.collection("tracks")
          .where("userId", "==", userId)
          .orderBy("trackId")
          // this required an index in firebase
          .onSnapshot((snapshot) => {
            const allTracks = snapshot.docs.map((track) => ({
              ...track.data(),
              docId: track.id,
            }));

            // if all tracks length is more than 0, set loading to false

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
            if (
              JSON.stringify(sortedAllTracks) !== JSON.stringify(sortedTracks)
            ) {
              setTracks(allTracks);
            }
          });
      } else {
      }
    });
  }, [tracks]);

  return {tracks, setTracks};
};

// TODO: resolve all promises at same time then set UserData
export const useUserData = (setLoading) => {
  const [userData, setUserData] = useState(null);
  let tasksMapToTrackId = [];
  let trackNameMapToTrackId = [];
  let userTracks = [];
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        let userId = auth.currentUser.uid;
        db.collection("tasks")
          .where("userId", "==", userId)
          .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              let task = doc.data();

              // if the trackId doesnt have any tasks add it to the map
              if (!tasksMapToTrackId[task.trackId]) {
                tasksMapToTrackId[task.trackId] = [];
              }
              if (!trackNameMapToTrackId[task.trackId]) {
                trackNameMapToTrackId[task.trackId] = [];
              }
              if (!userTracks[task.trackId]) {
                userTracks.push(task.trackName);
              }
              // add the task to the tasksMapToTrackId
              tasksMapToTrackId[task.trackId].push(task);
              // add the trackName to the trackNameMapToTrackId
              trackNameMapToTrackId[task.trackId].push(task.trackName);
            });
          });

        setUserData({
          tasksMapToTrackId: tasksMapToTrackId,
          trackNameMapToTrackId: trackNameMapToTrackId,
          userTracks: userTracks,
        });
      } else {
      }
    });
  }, []);

  useEffect(() => {
    if (userData !== null) {
      setLoading(false);
    }
  }, [userData]);
  return {userData, setUserData};
};
