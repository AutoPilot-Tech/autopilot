import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import AdapterMoment from "@mui/lab/AdapterMoment";
import {LocalizationProvider} from "@mui/lab";
import {Header} from "../components/layout/Header";
import {Content} from "../components/layout/Content";
import {TracksProvider} from "../context/tracks-context";
import {auth, db} from "../firebase";
import SyncLoader from "react-spinners/SyncLoader";
import {useLoadingValue} from "../context/loading-context";
import {useCalendarValue} from "../context/calendar-context";
import {Banner} from "../components/layout/Banner";
import {Sidebar} from "../components/layout/Sidebar";
import {CalendarHome} from "../components/layout/CalendarHome";
import {useParams} from "react-router-dom";
import {PlusSmIcon as PlusSmIconOutline} from "@heroicons/react/outline";
import {AddEvent} from "../components/functional/AddEvent";
import {TaskView} from "./TaskView";
import {Tasks} from "../components/Tasks";
import {gapi} from "gapi-script";
import {clientId} from "../pages/LoginNew";
// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const CalendarHomeView = () => {
  let {year, month, day} = useParams();
  // This is a global state provided by loading Context
  const {loading, setLoading} = useLoadingValue();
  const [userLoading, setUserLoading] = useState(false);
  const {googleEvents, setGoogleEvents, setDisplayName, setPhotoUrl} =
    useLoadingValue();
  const [showBanner, setShowBanner] = useState(false);
  const [isOpenEventModal, setIsOpenEventModal] = useState(false);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  // const {tracksLoading, setTracksLoading} = useLoadingValue();

  // get google events for signed in user
  const getGoogleEvents = () => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          clientId: clientId,
          scope: "https://www.googleapis.com/auth/calendar.events",
        })
        .then(() => {
          gapi.client.load("calendar", "v3", () => console.log("loaded"));
          gapi.auth2.getAuthInstance().signIn(); 
          gapi.client.calendar.events
          
            .list({
              calendarId: "primary",
              timeMin: new Date().toISOString(),
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: "startTime",
            })
            .then((response) => {
              console.log(response.result.items);
              const googleEvents = response.result.items;
              setGoogleEvents(googleEvents);
            });
        });
    });
  };

  // if the user isnt signed in send them back to login page
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user is signed in");
        // get the user's document from firestore
        getGoogleEvents();
        // get the user's name from db
        setDisplayName(user.displayName);
        setPhotoUrl(user.photoURL);
        setLoading(false);
        // check to see if the user's tracks are loaded
      } else {
        console.log("User is not signed in");
      }
    });
    return unsubscribe;
  }, []);

  return loading ? (
    <div className="grid place-items-center h-screen">
      <SyncLoader loading={true} size={15} speedMultiplier={2} />
      Syncing your Google Calendar...
    </div>
  ) : (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TracksProvider>
        <Header />
        <div className="overflow-x-hidden">
          <div className="relative" id="content">
            <Sidebar />
            {/* routes */}
            <Routes>
              <Route
                path="calendar/home"
                element={
                  <CalendarHome
                    year={year}
                    month={month}
                    day={day}
                    isOpenEventModal={isOpenEventModal}
                    setIsOpenEventModal={setIsOpenEventModal}
                  />
                }
              />
              <Route
                path="tasks/:trackId"
                element={
                  <Tasks
                    isOpenEventModal={isOpenEventModal}
                    setIsOpenEventModal={setIsOpenEventModal}
                  />
                }
              />
            </Routes>

            <AddEvent
              isOpenEventModal={isOpenEventModal}
              setIsOpenEventModal={setIsOpenEventModal}
            />
          </div>
        </div>
      </TracksProvider>
    </LocalizationProvider>
  );
};
