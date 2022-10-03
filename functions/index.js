const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const {google} = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");

const googleCredentials = require("./credentials.json");

const ERROR_RESPONSE = {
  status: "500",
  message: "Error adding event to Google Calendar",
};

const TIME_ZONE = "CST";
const admin = require("firebase-admin");
const moment = require("moment");
const {v4: uuidv4} = require("uuid");
let useEmulator;
if (process.env.FUNCTIONS_EMULATOR === true) {
  useEmulator = true;
} else {
  useEmulator = false;
}

if (useEmulator) {
  process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
}

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
  }),
  databaseURL: "https://autopilot-7ab12.firebaseio.com",
});

// this is what a google event looks like

var event = {
  summary: "Hello World",
  location: "",
  start: {
    dateTime: "2022-08-28T09:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  end: {
    dateTime: "2022-08-28T17:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      {method: "email", minutes: 24 * 60},
      {method: "popup", minutes: 10},
    ],
  },
};

// const api = express();
const db = admin.firestore();

function addEvent(event, auth) {
  return new Promise(function (resolve, reject) {
    calendar.events.insert(
      {
        auth: auth,
        calendarId: "primary",
        resource: {
          summary: event.eventName,
          description: event.description,
          start: {
            dateTime: event.startTime,
            timeZone: TIME_ZONE,
          },
          end: {
            dateTime: event.endTime,
            timeZone: TIME_ZONE,
          },
        },
      },
      (err, res) => {
        if (err) {
          console.log("Rejecting because of error");
          reject(err);
        }
        console.log("Request successful");
        resolve(res.data);
      }
    );
  });
}

// Stores element and its priority
class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

// Priority queue to be used for determining which routines
// that have deep work enabled should be filled into the
// scheduleArray
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  // helper method checks if queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  enqueue(element, priority) {
    var qElement = new QElement(element, priority);
    var contain = false;

    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }
    // if highest priority goes to back pf queue
    if (!contain) {
      this.items.push(qElement);
    }
  }

  // removes the highest priority element.
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }

  // returns the highest priority element.
  // Then it changes the priority of that element by -3.
  front() {
    if (this.isEmpty()) {
      return "nothing in queue";
    }
    highestPriorityItem = items[0];
    highestPriority = items[0].priority;

    // change the priotity of the highest priority element
    this.dequeue();
    this.enqueue(highestPriorityItem.element, highestPriority - 3);
    return this.items[0];
  }

  // returns lowest priority element
  rear() {
    if (this.isEmpty()) {
      return "nothing in queue";
    }
    return this.items[this.items.length - 1];
  }

  // prints all elements in the queue
  printPQueue() {
    var str = "";
    for (var i = 0; i < this.items.length; i++) {
      str += this.items[i].element + " ";
    }
    return str;
  }
}

exports.getGoogleCalendar = functions.https.onRequest(async (req, res) => {
  const oAuth2Client = new OAuth2(
    googleCredentials.web.client_id,
    googleCredentials.web.client_secret,
    googleCredentials.web.redirect_uris[0]
  );

  oAuth2Client.setCredentials({
    refresh_token: googleCredentials.refresh_token,
  });

  const events = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  res.send(events.data.items);
});

exports.addEventToCalendar = functions.https.onRequest((request, response) => {
  const eventData = {
    eventName: request.body.eventName,
    description: request.body.description,
    startTime: request.body.startTime,
    endTime: request.body.endTime,
  };
  const oAuth2Client = new OAuth2(
    googleCredentials.web.client_id,
    googleCredentials.web.client_secret,
    googleCredentials.web.redirect_uris[0]
  );

  oAuth2Client.setCredentials({
    refresh_token: googleCredentials.refresh_token,
  });

  addEvent(eventData, oAuth2Client)
    .then((data) => {
      response.status(200).send(data);
      return;
    })
    .catch((err) => {
      console.error("Error adding event: " + err.message);
      response.status(500).send(ERROR_RESPONSE);
      return;
    });
});

exports.onCreateUser = functions.auth.user().onCreate((user) => {
  const scheduleArray = Array(288).fill(null);
  // Create a new track with routine set to true for the user
  // createNewTrack(user.uid, "Errands", "bg-indigo-50", "text-indigo-500", false);
  // createNewTrack(user.uid, "Studying", "bg-blue-50", "text-blue-500", true);
  // createNewTrack(user.uid, "Morning", "bg-orange-50", "text-orange-500", true);
  // createNewTrack(user.uid, "Start here!", "bg-blue-50", "text-blue-500", false);
  let key = Math.random().toString(36).substring(7);

  // create a time at 7 am formatted in hh mm AM/PM
  const morningStart = moment().hour(7).minute(0).format("hh:mm A");
  const morningEnd = moment().hour(8).minute(30).format("hh:mm A");

  const userRef = db.collection("users").doc(user.uid);
  let parts = user.displayName.split("\\s+");
  let firstName = parts[0];

  let lastname = parts[1];
  return userRef.set({
    email: user.email,
    displayName: firstName,
    photoURL: user.photoURL,
    scheduleArray: scheduleArray,
    dayStart: 86,
    dayEnd: 254,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    noGoogleEvents: true,
  });
});

/**
 * Initial AutoFill: When user first signs up,
 * reset schedule,
 * or the day has just started at 12am.
 * NOTE: The trigger needs to be changed.
 */
exports.initialScheduleFill = functions.firestore
  .document("events/{eventId}")
  .onWrite(async (change) => {
    // get the event from the event id then get the userId
    const event = change.after.data();
    const userId = event.userId;

    // get the user's scheduleArray
    const scheduleArray = await getUserScheduleArray(userId);
    // get the user's events for today
    const todaysEvents = await getUserEventsForToday(userId);
    // fill in the user's scheduleArray with 1's for the events that start today
    const newScheduleArray = await scheduleFillForTodaysEvents(
      scheduleArray,
      todaysEvents,
      userId
    );
    // update the user's scheduleArray with the new array
    await updateUserScheduleArray(userId, newScheduleArray);
    functions.logger.log("autoPilot Schedule Fill finished.");
  });

/**
 * Get the user's schedule array
 */

async function getUserScheduleArray(userId) {
  const user = await db.collection("users").doc(userId).get();
  return user.data().scheduleArray;
}

/** Get the user's events and filter them for
 * events that start today
 */

async function getUserEventsForToday(userId) {
  const today = moment().format("YYYY-MM-DD");
  const querySnapshot = await db
    .collection("events")
    .where("userId", "==", userId)
    .get();
  // filter out all events that are not today
  const todayEvents = querySnapshot.docs.filter((event) => {
    return moment(event.data().start).format("YYYY-MM-DD") === today;
  });
  return await Promise.all(todayEvents);
}

/**
 * Fill in the user's schedule array with 1's
 * for the events that start today (INITIAL AUTO FILL)
 */
async function scheduleFillForTodaysEvents(
  scheduleArray,
  todaysEvents,
  userId
) {
  // get the user's tracks
  const tracks = await getUserTracks(userId);
  const dayStart = await db
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      return doc.data().dayStart;
    });
  const dayEnd = await db
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      return doc.data().dayEnd;
    });

  console.log(`DAY START: ${dayStart}`);
  console.log(`DAY END: ${dayEnd}`);

  todaysEvents.forEach((event) => {
    // Add this event to the user's events
    // addEventToUserEvents(event.data());
    const startGridRow = event.data().gridRow;
    const endGridRow = event.data().gridRow + (event.data().span - 1);
    for (let i = startGridRow - 1; i <= endGridRow; i++) {
      scheduleArray[i] = 1;
    }

    for (let i = dayStart; i <= dayEnd; i++) {
      let consecutiveNulls = 0;
      let consecutiveNullsStart = 0;
      let consecutiveNullsEnd = 0;
      for (let j = i; j <= i + 23; j++) {
        // if this is the first non one, set the consetiveNonOneStart
        if (j == i && scheduleArray[j] === null) {
          consecutiveNullsStart = j;
        }
        // if this index is not a one, increment
        if (scheduleArray[j] === null) {
          consecutiveNulls++;
        }
        // Currently we are setting it to 24
        // to account for 2 hours.
        // As we grow, this algorithm will get
        // more sophisticated.
        if (consecutiveNulls === 24) {
          consecutiveNullsEnd = consecutiveNullsStart + 23;
          // now fill the consecutive openings with a random number
          let randomNumber = Math.floor(Math.random() * 100);
          for (let k = i; k <= i + 23; k++) {
            scheduleArray[k] = randomNumber;
          }
          consecutiveNulls = 0;

          let maintenanceRequired = false;
          if (tracks.length > 0) {
            // Getting Random Track Variation:
            let randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
            let trackId = randomTrack.trackId;
            // Change this soon
            let routineId = "444444";
            let title = randomTrack.name;
            let textColor = randomTrack.textColor;
            let bgColor = randomTrack.bgColor;

            // Get the user's priorityQueue
            // const userPriorityQueue = getUserPriorityQueue(userId);

            // take consecutiveNullStart and get the original time from it
            let gridRowForCalendar = consecutiveNullsStart - 1;
            let startTimeInHoursDecimal = gridRowForCalendar / 12;
            let minutes;
            let hours;
            // if startTime has a decimal place then extract it and save it
            if (startTimeInHoursDecimal % 1 !== 0) {
              let startTimeDecimal = startTimeInHoursDecimal % 1;
              let startTimeWhole = startTimeInHoursDecimal - startTimeDecimal;
              // remove the decimal from starTimeInHoursDecimal and save to startTimeFraction
              minutes = startTimeDecimal * 60;
              hours = startTimeWhole;
            } else {
              minutes = 0;
              hours = startTimeInHoursDecimal;
            }

            // make a moment time with the minutes and hours
            let startTime = moment()
              .hours(hours)
              .minutes(minutes)
              .format("hh:mm A");

            // add two hours to the starTtime
            let endTime = moment(startTime, "hh:mm A")
              .add(2, "hours")
              .format("hh:mm A");

            // generate a random key for the <li>
            let key = Math.random().toString(36).substring(7);

            // add the event to the user's events
            db.collection("users").doc(userId).collection("events").add({
              archived: false,
              trackId: trackId,
              routineId: routineId,
              title: title,
              startTime: startTime,
              endTime: endTime,
              userId: userId,
              maintenanceRequired: maintenanceRequired,
              gridRow: consecutiveNullsStart,
              span: 24,
              textColor: textColor,
              bgColor: bgColor,
              key: key,
            });
          }
        }
      }
    }
  });

  // Now go through the scheduleArray and fill in nulls with the errand routine.
  // get the information about the user's errand routine.
  // const errandRoutine = await getErrandRoutine(userId);
  // for (let i = 0; i < scheduleArray.length; i++) {
  //   if (scheduleArray[i] === null) {
  //     scheduleArray[i] = errandRoutine.data();
  //   }
  // }
  return scheduleArray;
}

/**
 * Get the user's priority queue
 */
function getUserPriorityQueue(userId) {
  const priorityQueue = db
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      // get priority queue
      return doc.data().priorityQueue;
    });
  return priorityQueue;
}

/**
 * Get the user's errand routine
 */
// async function getErrandRoutine(userId) {
//   // Find the track that has the name "Errands"
//   const errandTrack = await db
//     .collection("tracks")
//     .where("userId", "==", userId)
//     .where("name", "==", "Errands")
//     .get();
//   // get the routineId of the errand routine
//   return errandTrack;
// }

/**
 * Update the user's scheduleArray
 * with the given array
 */
function updateUserScheduleArray(userId, scheduleArray) {
  return db.collection("users").doc(userId).update({
    scheduleArray: scheduleArray,
  });
}

/**
 * Get the user's tracks
 * filter out any routines
 */

async function getUserTracks(userId) {
  const querySnapshot = await db
    .collection("tracks")
    .where("userId", "==", userId)
    .get();
  let tracks = [];
  querySnapshot.forEach((track) => {
    tracks.push(track.data());
  });
  return tracks;
}

/**
 * Create a new track for the user
 */
async function createNewTrack(
  userId,
  trackName,
  bgColor,
  textColor,
  routineBoolean
) {
  const trackId = uuidv4();
  const track = {
    trackId: trackId,
    userId: userId,
    name: trackName,
    textColor: textColor,
    bgColor: bgColor,
    routine: routineBoolean,
    starter: true,
  };
  await db.collection("tracks").doc(trackId).set(track);
  // if the trackName is "Morning"
  if (trackName === "Morning") {
    createNewTask(userId, "Wake up", trackId);
    createNewTask(userId, "Exercise", trackId);
    createNewTask(userId, "Eat a healthy breakfast", trackId);
  } else if (trackName === "Studying") {
    createNewTask(userId, "Turn off distractions", trackId);
    createNewTask(userId, "Set pomodoro timer", trackId);
    createNewTask(userId, "Focus", trackId);
  } else if (trackName === "Errands") {
    createNewTask(userId, "Get groceries", trackId);
    createNewTask(userId, "Get gas", trackId);
    createNewTask(userId, "Apply to internships", trackId);
  } else if (trackName === "Start here!") {
    createNewTask(userId, "Welcome to Autopilot (:", trackId);
    createNewTask(
      userId,
      "Get started by revising routines and the habits and tasks in them - or make some of your own...",
      trackId
    );
    createNewTask(userId, "Lastly, review your daily schedule!", trackId);
    createNewTask(
      userId,
      "You can always reach out to the creators of Autopilot with the 'Your Assistant' tab!",
      trackId
    );
    createNewTask(
      userId,
      "We love to hear your thoughts, give you advice on your schedule, and we would love to make features you feel are missing.",
      trackId
    );
    createNewTask(userId, "Enjoy!", trackId);
  }
  return track;
}

/**
 * Create a new task for the user
 */
async function createNewTask(userId, taskName, trackId) {
  const taskId = uuidv4();
  // generate key for task
  const key = Math.random().toString(36).substring(7);
  const task = {
    archived: false,
    userId: userId,
    task: taskName,
    title: taskName,
    trackId: trackId,
    key: key,
  };
  await db.collection("tasks").doc(taskId).set(task);
  return task;
}

/**
 * Add event to user's events
 */
// async function addEventToUserEvents(event) {
//   // add the event to the user's event collection
//   const userEventsRef = db.collection("users").doc(event.userId);
//   await userEventsRef.collection("events").add(event);
//   return;
// }
