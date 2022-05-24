import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard";
import {Landing} from "./pages/Landing";
import {Settings} from "./pages/Settings";
import {LoginNew} from "./pages/LoginNew";
import {SignupNew} from "./pages/SignupNew";
import {useLoadingValue} from "./context/loading-context";
import {TracksProvider} from "./context/tracks-context";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {CalendarHomeView} from "./pages/CalendarHomeView";
import {CalendarWeekView} from "./pages/CalendarWeekView";
import {CalendarMonthView} from "./pages/CalendarMonthView";
import {TaskView} from "./pages/TaskView";
import SyncLoader from "react-spinners/SyncLoader";
import {auth} from "./firebase";

export const ViewController = () => {
  const {loading, setLoading} = useLoadingValue();
  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("User is signed in.");
          setLoading(false);
        } else {
          console.log("User is signed out.");
        }
      }),
    []
  );

  return loading ? (
    <div className="grid place-items-center h-screen">
      <SyncLoader loading={true} size={15} speedMultiplier={2} />
    </div>
  ) : (
    <TracksProvider>
      <Routes>
        <Route path="dashboard/*" element={<CalendarHomeView />} />
      </Routes>
    </TracksProvider>
  );
};
