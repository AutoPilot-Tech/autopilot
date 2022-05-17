import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard";
import {Landing} from "./pages/Landing";
import {Settings} from "./pages/Settings";
import {LoginNew} from "./pages/LoginNew";
import {SignupNew} from "./pages/SignupNew";
import {LoadingProvider} from "./context/loading-context";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {CalendarHomeView} from "./pages/CalendarHomeView";
import {CalendarWeekView} from "./pages/CalendarWeekView";
import {CalendarMonthView} from "./pages/CalendarMonthView";
import {TaskView} from "./pages/TaskView";

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <LoadingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignupNew />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<LoginNew />} />
            <Route path="/app/calendar/home" element={<CalendarHomeView />} />
            <Route path="/app/calendar/week" element={<CalendarWeekView />} />
            <Route path="/app/calendar/month" element={<CalendarMonthView />} />
            <Route path="/app/tasks/:id" element={<TaskView />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </DndProvider>
  );
};
