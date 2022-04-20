import moment from "moment";
import {useEffect, useState} from "react";
import {auth, db} from "../firebase";

export function WelcomeBack() {
  // get the user's name
  const [displayName, setDisplayName] = useState("");
  const [greeting, setGreeting] = useState("");
  // get current hour formatted in 24 hour time
  const currentHour = moment().format("H");
  // format in 12 hour time
  const oClock = moment().format("hh");

  // 12 am - 3am
  const greeting1 = [
    `What's in your drink ${displayName}?`,
    `How much coffee have you had, ${displayName}?`,
    `Remember to hydrate on your all nighter ${displayName}!`,
    `RIP ${displayName}`,
    `${displayName}, you're a good person.`,
    `${displayName}, don't give up now.`,
    `${displayName}, you're doing great.`,
    `${displayName}, it's Demon Hours.`,
    `${displayName} please tell me you're not at the PCL.`,
    `${displayName} you're at the PCL aren't you?`,
  ];

  // 3 am - 6am
  const greeting2 = [
    `Is it morning or night?`,
    `Legends are waking up at 5am or going to bed at 5am, ${displayName}`,
    `It's ${oClock} o'clock, ${displayName}`,
    `Freaky hours, ${displayName}`,
    `We believe in you, ${displayName}`,
    `It's ${oClock} o'clock, ${displayName}... and OU still sucks.`,
  ];

  // 6 am - 12pm
  const greeting3 = [
    `Good Morning, ${displayName}!`,
    `Rise and shine, ${displayName}!`,
    `Have a great day, ${displayName}!`,
    `Let\'s start the day off right, ${displayName}!`,
    `Last night took an L but tonight we bounce back, ${displayName}`,
  ];

  // 12pm - 6pm
  const greeting4 = [
    `Good Afternoon, ${displayName}!`,
    `Welcome back, ${displayName}!`,
    `It's ${oClock} o'clock, ${displayName}... and OU still sucks.`,
    `The day isn't over yet, ${displayName}!`,
    `${displayName}, you're doing great.`,
  ];

  // 6pm - 8pm
  const greeting5 = [
    `Good Evening, ${displayName}!`,
    `Enjoy your dinner, ${displayName}!`,
  ];

  // 8pm - 10pm
  const greeting6 = [
    `Good Night, ${displayName}!`,
    `To rest... or to work... that is the question.`,
  ];
  // 10pm - 12am
  const greeting7 = [
    `Good Night, ${displayName}!`,
    `Welcome Back, ${displayName}!`,
    `We're ready, are you?`,
  ];

  // get the user's first name
  useEffect(() => {
    let unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot((doc) => {
        setDisplayName(doc.data().displayName);
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
              ? greeting1[Math.floor(Math.random() * greeting1.length)]
              : // if the current hour is between 3am and 6am
              currentHour >= 3 && currentHour < 6
              ? greeting2[Math.floor(Math.random() * greeting2.length)]
              : // if the current hour is between 6am and 12pm
              currentHour >= 6 && currentHour < 12
              ? greeting3[Math.floor(Math.random() * greeting3.length)]
              : // if the current hour is between 12pm and 6pm
              currentHour >= 12 && currentHour < 18
              ? greeting4[Math.floor(Math.random() * greeting4.length)]
              : // if the current hour is between 6pm and 8pm
              currentHour >= 18 && currentHour < 20
              ? greeting5[Math.floor(Math.random() * greeting5.length)]
              : // if the current hour is between 8pm and 10pm
              currentHour >= 20 && currentHour < 22
              ? greeting6[Math.floor(Math.random() * greeting6.length)]
              : // if the current hour is between 10pm and 12am
              currentHour >= 22 && currentHour < 24
              ? greeting7[Math.floor(Math.random() * greeting7.length)]
              : ""
          }
        </h2>
      </div>
    </div>
  );
}
