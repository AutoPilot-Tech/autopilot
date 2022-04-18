import React, {useEffect} from "react";
import {Sidebar} from "./Sidebar";
import {Tasks} from "../Tasks";
import {Calendar} from "../Calendar";
import {useTracksValue} from "../../context/tracks-context";

export const Content = () => {
  return (
    <div className="grow">
      <Sidebar />
      <Tasks />
    </div>
  );
};
