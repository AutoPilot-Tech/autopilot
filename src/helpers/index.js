import {collatedTasks} from "../constants";
import {colorsList} from "../constants";
import {db} from "../firebase";
import moment from "moment";

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
export const generatePushId = (function () {
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  var PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  var lastPushTime = 0;

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we'll use those same characters except
  // "incremented" by one.
  var lastRandChars = [];

  return function () {
    var now = new Date().getTime();
    var duplicateTime = now === lastPushTime;
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0)
      throw new Error("We should have converted the entire timestamp.");

    var id = timeStampChars.join("");

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) throw new Error("Length should be 20.");

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

export const handleTimeValueStringProcessing = (timeValue) => {
  // get hour and minute from finalTimeValue string
  // if ":" is not in the string, then it is a single digit
  // if ":" is in the string, then it is a double digit
  let hour =
    timeValue.indexOf(":") === -1
      ? parseInt(timeValue)
      : parseInt(timeValue.split(":")[0]);
  let minute =
    timeValue.indexOf(":") === -1 ? 0 : parseInt(timeValue.split(":")[1]);
  // set modalEndTimeValue to the final time
  // if pm is in the string, add 12 hours to the hour
  if (timeValue.indexOf("pm") !== -1 && hour !== 12) {
    hour += 12;
  }
  if (hour === 12 && timeValue.indexOf("am") !== -1) {
    hour = 0;
  }
  let timeString = moment().hour(hour).minute(minute).format("h:mm A");
  return timeString;
};

export const handleTimeValueToObject = (timeValue) => {
  // get hour and minute from finalTimeValue string
  // if ":" is not in the string, then it is a single digit
  // if ":" is in the string, then it is a double digit
  let hour;
  let minute;
  hour =
    timeValue.indexOf(":") === -1
      ? parseInt(timeValue)
      : parseInt(timeValue.split(":")[0]);
  minute =
    timeValue.indexOf(":") === -1 ? 0 : parseInt(timeValue.split(":")[1]);
  // set modalEndTimeValue to the final time
  // if pm is in the string, add 12 hours to the hour
  if (timeValue.indexOf("pm") !== -1 && hour !== 12) {
    hour += 12;
  }

  let timeObject = moment().hour(hour).minute(minute);
  return timeObject;
};

export const getGridRowFromTime = (time) => {
  let startHour = moment(time).hours();
  let startMinute = moment(time).minutes();
  let fractionalHour = startMinute / 60;
  let startTimeInHoursDecimal = startHour + fractionalHour;
  let gridRowForCalendar = Math.floor(startTimeInHoursDecimal * 12) + 2;
  return gridRowForCalendar;
};

export const getGridSpanFromTime = (startTime, endTime) => {
  let durationInMinutes = moment(endTime).diff(moment(startTime), "minutes");
  let durationInHoursDecimal = Math.round((durationInMinutes / 60) * 12);
  return durationInHoursDecimal;
};
