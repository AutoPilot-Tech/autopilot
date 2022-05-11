import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Dashboard} from "./pages/Dashboard";
import {Landing} from "./pages/Landing";
import {Login} from "./pages/Login";
import {Signup} from "./pages/Signup";
import {Settings} from "./pages/Settings";
import {LoginNew} from "./pages/LoginNew";
import {SignupNew} from "./pages/SignupNew";
import {LandingNew} from "./pages/LandingNew";
import {LoadingProvider} from "./context/loading-context";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {CalendarHome} from "./components/layout/CalendarHome";
import {CalendarWeekView} from "./components/layout/CalendarWeekView";
import {CalendarMonthView} from "./components/layout/CalendarMonthView";

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <LoadingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignupNew />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<LoginNew />} />
            <Route path="/calendar/home" element={<CalendarHome />} />
            <Route path="/calendar/week" element={<CalendarWeekView />} />
            <Route path="/calendar/month" element={<CalendarMonthView />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </DndProvider>
  );
};
