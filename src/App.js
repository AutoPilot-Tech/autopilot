import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard";
import {Landing} from "./pages/Landing";
import {Settings} from "./pages/Settings";
import {LoginNew} from "./pages/LoginNew";
import {SignupNew} from "./pages/SignupNew";
import {LoadingProvider} from "./context/loading-context";
import {TracksProvider} from "./context/tracks-context";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {CalendarHomeView} from "./pages/CalendarHomeView";
import {CalendarWeekView} from "./pages/CalendarWeekView";
import {CalendarMonthView} from "./pages/CalendarMonthView";
import {TaskView} from "./pages/TaskView";
import SyncLoader from "react-spinners/SyncLoader";
import {auth} from "./firebase";
import {GoogleLogin} from "react-google-login";
import {gapi} from "gapi-script";

const clientId =
  "39033041323-td4qpdmn6t5765rvdev51v68f7qof0pv.apps.googleusercontent.com";

export const App = () => {
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });
  return (
    <DndProvider backend={HTML5Backend}>
      <LoadingProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={<Landing />} /> */}
            <Route path="/signup" element={<SignupNew />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<LoginNew />} />
            {/* React Router V6 and above doesn't support optional paths so we have to make several.. */}
            <Route path="/app/*" element={<CalendarHomeView />} />
            <Route
              path="/app/calendar/home/:year/:month/:day"
              element={<CalendarHomeView />}
            />
            <Route path="/app/calendar/week" element={<CalendarWeekView />} />
            <Route
              path="/app/calendar/week/:year/:month/:day"
              element={<CalendarWeekView />}
            />
            <Route path="/app/calendar/month" element={<CalendarMonthView />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </DndProvider>
  );
};
