import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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

export const onCreateUser = functions.auth.user().onCreate((user) => {
  const userRef = db.collection("users").doc(user.uid);
  return userRef.set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
