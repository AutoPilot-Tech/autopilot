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
import { LoadingProvider } from "./context/loading-context";

export const App = () => {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignupNew />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<LoginNew />} />
        </Routes>
      </Router>
    </LoadingProvider>
  );
};
