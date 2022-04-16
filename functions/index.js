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
  .onWrite((change, context) => {
    // get the event from the event id then get the userId
    const event = change.after.data();
    const userId = event.userId;
    const today = moment().format("YYYY-MM-DD");

    // look up the user and get their scheduleArray
    return (
      db
        .collection("users")
        .doc(userId)
        .get()
        .then((doc) => {
          // get the scheduleArray
          return doc.data().scheduleArray;
        })
        // get all events from the database with this userId
        .then((scheduleArray) => {
          return db
            .collection("events")
            .where("userId", "==", userId)
            .get()
            .then((querySnapshot) => {
              // filter out all events that are not today
              const todayEvents = querySnapshot.docs.filter((event) => {
                return (
                  moment(event.data().start).format("YYYY-MM-DD") === today
                );
              });
              return Promise.all(todayEvents);
            })
            .then((eventsThatAreScheduledToday) => {
              // go through todays events
              // and get the gridRow for each event
              eventsThatAreScheduledToday.forEach((event) => {
                console.log("event", event);
                const startGridRow = event.gridRow;
                const endGridRow = event.gridRow + (event.span - 1);
                for (let i = startGridRow - 1; i <= endGridRow; i++) {
                  // set the scheduleArray type to array
                  scheduleArray[i] = event;
                }
              });
              return scheduleArray;
            });
        })
        .then((scheduleArray) => {
          // update the scheduleArray
          console.log("Updating user's schedule array....");
          console.log("New scheduleArray", scheduleArray);
          return db.collection("users").doc(userId).update({
            scheduleArray: scheduleArray,
          });
        })
    );
  });
