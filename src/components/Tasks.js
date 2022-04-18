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

  let trackName = "";

  if (collatedTasksExist(selectedTrack) && selectedTrack) {
    // if the selected track is a collated track (i.e. TODAY, NEXT_7, etc)
    trackName = getCollatedTitle(collatedTasks, selectedTrack);
    // if the collated track is NEXT_7, then we will show a calendar
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
    if (selectedTrack === "NEXT_7") {
      setShowCalendar(true);
      setShowChat(false);
    } else if (selectedTrack === "ASSISTANT") {
      // this is for the future.
      setShowChat(true);
    } else {
      setShowCalendar(false);
      setShowChat;
    }
    console.log("isRoutine", isRoutine);
  }, [selectedTrack]);

  useEffect(() => {
    document.title = `Autopilot: ${trackName}`;
  }, [trackName]);

  // if setCalendar is true, then we will show the calendar

  return (
    <div>
      {showCalendar ? (
        <Calendar />
      ) : (
        <div className="ml-80 mr-64 pt-20 flex flex-col" data-testid="tasks">
          <TaskHeader trackName={trackName} />
          {/* <ColorSettings /> */}
          {isRoutine ? <RoutineSettings /> : <></>}

          {/* if there are no tasks, show the emptystate component, otherwise render them */}
          {tasks.length === 0 ? (
            <EmptyStateTasks />
          ) : (
            <>
              <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 sm:left-16">
                <button
                  type="button"
                  className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Delete all
                </button>
              </div>
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="relative w-12 px-6 sm:w-16 sm:px-8"
                    >
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Task
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className={
                        selectedTasks.includes(task) ? "bg-gray-50" : undefined
                      }
                    >
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        {selectedTasks.includes(task) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          value={task.task}
                          checked={selectedTasks.includes(task)}
                          onChange={(e) =>
                            setSelectedTasks(
                              e.target.checked
                                ? [...selectedTasks, task]
                                : selectedTasks.filter((t) => t !== t)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          "whitespace-nowrap py-4 pr-3 text-sm font-medium",
                          selectedTasks.includes(task)
                            ? "text-indigo-600"
                            : "text-gray-900"
                        )}
                      >
                        {task.task}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <AddTask />
        </div>
      )}
    </div>
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
