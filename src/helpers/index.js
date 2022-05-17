import {collatedTasks} from "../constants";
import {colorsList} from "../constants";
import {db} from "../firebase";

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorsList.length);
  return colorsList[randomIndex];
};

export const getTitle = (tracks, selectedTrackId) => {
  let track = tracks.find((track) => track.trackId === selectedTrackId);
  return track.name;
};

export const getCollatedTitle = (tracks, key) => {
  let track = tracks.find((track) => track.key === key);
  return track.name;
};

export const collatedTasksExist = (selectedTrack) => {
  return collatedTasks.find((task) => task.key === selectedTrack);
};

export const getRoutines = (tracks) => {
  return tracks.filter((track) => track.routine);
};

export const findRoutineName = (routines, trackName) => {
  let routine = routines.find((routine) => routine.name === trackName);
  return routine.name;
};

// this is just taken from online, its similar to how firebase does it
export const generatePushId = (() => {
  const PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

  const lastRandChars = [];

  return function () {
    let now = new Date().getTime();

    const timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }

    let id = timeStampChars.join("");

    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }

    return id;
  };
})();

export const sortedObject = (unordered) => {
  return Object.keys(unordered)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    }, {});
};

// sort array of objects by key value pair index
export const sortArrayOfObjects = (array) => {
  return array.sort((a, b) => {
    return a.index - b.index;
  });
};

export const getTasksLength = (trackId) => {
  const unsubscribe = db
    .collection("tasks")
    .where("trackId", "==", trackId)
    .get()
    .then((snapshot) => {
      let tasksLength = snapshot.docs.length;
      return tasksLength;
    });
  return unsubscribe;
};
