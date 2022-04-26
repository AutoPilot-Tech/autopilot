import React, {useEffect} from "react";
import {Sidebar} from "./Sidebar";
import {Tasks} from "../Tasks";
import {Calendar} from "../Calendar";
import {useTracksValue} from "../../context/tracks-context";
import {Banner} from "./Banner";

export const Content = () => {
  return (
    <div className="grow flex-row mb-48 order-2">
      <Sidebar />
      <Tasks />
    </div>
  );
};
