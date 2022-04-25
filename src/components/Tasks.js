import React, {useEffect, useState, useRef, useLayoutEffect} from "react";
import {collection, getDocs} from "firebase/firestore";
import {Checkbox} from "./Checkbox";
import {useTasks} from "../hooks";
import {collatedTasks} from "../constants";
import {getTitle, getCollatedTitle, collatedTasksExist} from "../helpers";
import {useTracksValue} from "../context/tracks-context";
import {AddTask} from "./AddTask";
import {auth} from "../firebase";
import {Calendar} from "../../src/components/Calendar";
import {getRoutines} from "../helpers";
import {findRoutine} from "../helpers";
import {RoutineSettings} from "./RoutineSettings";
import {FaTrashAlt} from "react-icons/fa";
import {db} from "../firebase";
import {TaskHeader} from "./TaskHeader";
import {EmptyStateTasks} from "./EmptyStateTasks";
import {ColorSettings} from "./ColorSettings";
import {AddTaskNew} from "./AddTaskNew";
import {AutopilotSettings} from "./AutopilotSettings";
import {IndividualTask} from "./IndividualTask";
import {Scrollbars} from "react-custom-scrollbars";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// this just gets the tasks and renders them
export const Tasks = () => {
  const {tracks, selectedTrack, isRoutine, setIsRoutine} = useTracksValue();
  let {tasks} = useTasks(selectedTrack);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  let trackName = "";

  if (collatedTasksExist(selectedTrack) && selectedTrack) {
    // if the selected track is a collated track (i.e. TODAY, CALENDAR, etc)
    trackName = getCollatedTitle(collatedTasks, selectedTrack);
  }

  if (
    // if the selected track is not a collated track (i.e. a specific track)
    tracks &&
    tracks.length > 0 &&
    selectedTrack &&
    !collatedTasksExist(selectedTrack)
  ) {
    trackName = getTitle(tracks, selectedTrack);
  }

  const deleteTask = (docId) => {
    db.collection("tasks")
      .doc(docId)
      .delete()
      .then(() => {
        console.log("task deleted");
      });
  };

  // useLayoutEffect(() => {
  //   const isIndeterminate =
  //     selectedTasks.length > 0 && selectedTasks.length < tasks.length;
  //   setChecked(selectedTasks.length === tasks.length);
  //   setIndeterminate(isIndeterminate);
  //   checkbox.current.indeterminate = isIndeterminate;
  // }, [selectedTasks]);

  function toggleAll() {
    setSelectedTasks(checked || indeterminate ? [] : people);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  // When selectedTrack changes, we want to check to see if it's the calendar
  useEffect(() => {
    if (selectedTrack === "CALENDAR") {
      setShowCalendar(true);
      setShowChat(false);
      setShowSettings(false);
    } else if (selectedTrack === "ASSISTANT") {
      // this is for the future.
      setShowChat(true);
      setShowSettings(false);
    } else if (selectedTrack === "SETTINGS") {
      setShowCalendar(false);
      setShowChat(false);
      setShowSettings(true);
    } else {
      setShowCalendar(false);
      setShowSettings(false);
    }
  }, [selectedTrack]);

  useEffect(() => {
    document.title = `Autopilot: ${trackName}`;
  }, [trackName]);

  // if setCalendar is true, then we will show the calendar

  return (
    <>
      {
        showCalendar ? (
          <Calendar />
        ) : showSettings ? (
          <AutopilotSettings />
        ) : (
          <div
            className="ml-80 mr-64 pt-20 pl-1 pr-1 flex-col grow h-fit"
            data-testid="tasks"
          >
            <TaskHeader trackName={trackName} />
            {/* <ColorSettings /> */}
            {isRoutine ? <RoutineSettings /> : <></>}

            {/* if there are no tasks, show the emptystate component, otherwise render them */}
            {tasks.length === 0 ? (
              <EmptyStateTasks />
            ) : (
              <>
                <div className="relative shadow ring-2 p-1 bg-white ring-black ring-opacity-5 md:rounded-lg ">
                  <div className="min-w-full divide-y divide-gray-300">
                    <div className="divide-y divide-gray-200 bg-white">
                      <ul>
                        {tasks.map((task) => (
                          <li key={task.id}>
                            <IndividualTask task={task} key={task.id} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) // if showSettings is true, show settings
      }
    </>
  );
  //     <h2 data-testid="track-name">{trackName}</h2>

  //     <ul className="tasks__list">
  //       {tasks.map((task) => (
  //         <li key={`${task.id}`}>
  //           <Checkbox id={task.id} />
  //           <span>{task.task}</span>
  //         </li>
  //       ))}
  //     </ul>
  //     <AddTask />
  //   </div>
  // );
};
