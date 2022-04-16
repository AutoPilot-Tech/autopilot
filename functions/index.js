const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const useEmulator = true;

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

const db = admin.firestore();

exports.onCreateUser = functions.auth.user().onCreate((user) => {
  const scheduleArray = Array(288).fill(null);
  const userRef = db.collection("users").doc(user.uid);
  return userRef.set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    scheduleArray: scheduleArray,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

exports.autoPilot = functions.firestore
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
      todaysEvents
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
 * for the events that start today
 */
function scheduleFillForTodaysEvents(scheduleArray, todaysEvents) {
  todaysEvents.forEach((event) => {
    const startGridRow = event.data().gridRow;
    const endGridRow = event.data().gridRow + (event.data().span - 1);
    console.log(`startGridRow: ${startGridRow}`);
    console.log(`endGridRow: ${endGridRow}`);
    for (let i = startGridRow - 1; i <= endGridRow; i++) {
      scheduleArray[i] = 1;
    }
  });
  // print every element in scheduleArray
  for (let i = 0; i < scheduleArray.length; i++) {
    console.log(scheduleArray[i]);
  }
  return scheduleArray;
}

/**
 * Update the user's scheduleArray
 * with the given array
 */
function updateUserScheduleArray(userId, scheduleArray) {
  return db.collection("users").doc(userId).update({
    scheduleArray: scheduleArray,
  });
}
