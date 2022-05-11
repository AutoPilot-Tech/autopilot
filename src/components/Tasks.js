import React, {useEffect, useState, useRef, useCallback} from "react";
import update from "immutability-helper";

import {useTasks} from "../hooks";
import {collatedTasks} from "../constants";
import {getTitle, getCollatedTitle, collatedTasksExist} from "../helpers";
import {useTracksValue} from "../context/tracks-context";

import {Calendar} from "../../src/components/Calendar";

import {RoutineSettings} from "./RoutineSettings";
import {db} from "../firebase";
import {TaskHeader} from "./TaskHeader";
import {EmptyStateTasks} from "./EmptyStateTasks";
import {AutopilotSettings} from "./AutopilotSettings";
import {IndividualTask} from "./IndividualTask";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// this just gets the tasks and renders them
export const Tasks = () => {
  const {tracks, selectedTrack, isRoutine} = useTracksValue();
  let {tasks, setTasks} = useTasks(selectedTrack);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const tasksRef = useRef(tasks);

  const moveTaskListItem = useCallback((dragIndex, hoverIndex) => {
    setTasks((prevTasks) =>
      update(prevTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTasks[dragIndex]],
        ],
      })

    );

  }, []);

  const renderTask = useCallback((task, tasks) => {
    return (
      <li key={task.id}>
        <IndividualTask
          task={task}
          key={task.id}
          index={task.index}
          moveListItem={moveTaskListItem}
          tasks={tasks}
        />
      </li>
    );
  }, []);

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
            className="ml-80 pt-20 pl-1 pr-1 flex-col grow h-fit mr-28"
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
                      <ul>{tasks.map((task) => renderTask(task, tasks))}</ul>
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
