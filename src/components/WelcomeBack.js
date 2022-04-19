import moment from "moment";
import {useEffect, useState} from "react";
import {auth, db} from "../firebase";

export function WelcomeBack() {
  // get the user's name
  const [displayName, setdisplayName] = useState("");
  const [greeting, setGreeting] = useState("");
  // get current hour formatted in 24 hour time
  const currentHour = moment().format("H");

  // get the user's first name
  useEffect(() => {
    let unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot((doc) => {
        setdisplayName(doc.data().displayName);
      });
    return () => {
      unsubscribe();
    };
  }, []);
    

  return (
    <div className="md:flex md:items-center md:justify-between pt-3 pb-5 ml-2">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          {
            // if the current hour is between 12 am and 3am
            currentHour >= 0 && currentHour < 3
              ? `Demon Hours, ${displayName}?`
              : // if the current hour is between 3am and 6am
              currentHour >= 3 && currentHour < 6
              ? `Is it morning or night, ${displayName}?`
              : // if the current hour is between 6am and 12pm
              currentHour >= 6 && currentHour < 12
              ? `Good Morning, ${displayName}!`
              : // if the current hour is between 12pm and 6pm
              currentHour >= 12 && currentHour < 18
              ? `Good Afternoon, ${displayName}!`
              : // if the current hour is between 6pm and 8pm
              currentHour >= 18 && currentHour < 20
              ? `Good Evening, ${displayName}!`
              : // if the current hour is between 8pm and 12am
              currentHour >= 20 && currentHour < 24
              ? `Good Night, ${displayName}!`
              : ""
          }
        </h2>
      </div>
    </div>
  );
}
