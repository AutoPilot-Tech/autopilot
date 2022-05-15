import React, {useEffect} from "react";
import {Sidebar} from "./Sidebar";
import {Tasks} from "../Tasks";
import {Calendar} from "../Calendar";
import {useTracksValue} from "../../context/tracks-context";
import {Banner} from "./Banner";
import {CalendarHome} from "./CalendarHome";

export const Content = () => {
  return (
    <div className="relative grow flex-row" id="content">
      <Sidebar />
      <CalendarHome />
    </div>
  );
};
