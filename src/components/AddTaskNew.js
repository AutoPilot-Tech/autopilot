import React, {useState, useEffect, Fragment} from "react";
import moment from "moment";
import {db, auth} from "../firebase";
import {useTracksValue} from "../context/tracks-context";

import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";
import {amplitude} from "../utilities/amplitude";
import {Transition, Dialog} from "@headlessui/react";
import {PlusIcon} from "@heroicons/react/solid";
import {useTasks} from "../hooks/index";

export const AddTaskNew = ({shouldShowMain = false}) => {
  const {selectedTrack} = useTracksValue();
  const {tasksLength} = useTasks(selectedTrack);
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStartDate, setTaskStartDate] = useState("");
  const [taskEndDate, setTaskEndDate] = useState("");
  const [track, setTrack] = useState("");
  const [showMain, setShowMain] = useState(shouldShowMain);
  const [showTrackOverlay, setShowTrackOverlay] = useState(false);
  const [showTaskDate, setShowTaskDate] = useState(false);
  const [user, setUser] = useState(null);

  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");

  function closeModal() {
    console.log("closing modal");
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // this is the user's id
        setUser(user.uid);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  };

  // get tasks for this track then get length

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      addTask();
      closeModal();
    }
  };

  const addTask = () => {
    // if tasks is undefined, set taskLength to 0

    const trackId = track || selectedTrack;
    let collatedDate = "";
    // generate key for this task
    let key = Math.random().toString(36).substring(7);
    // get the number of tasks for this track

    if (trackId === "TODAY") {
      collatedDate = moment().format("YYYY-MM-DD");
    } else if (trackId === "NEXT_7") {
      collatedDate = moment().add(7, "days").format("YYYY-MM-DD");
    }
    return (
      task &&
      trackId &&
      db
        .collection("tasks")
        .add({
          archived: false,
          trackId: trackId,
          task: task,
          title: task,
          date: collatedDate || taskDate,
          start: taskStartDate,
          end: taskEndDate,
          userId: user,
          key: key,
          index: tasksLength,
        })
        .then(() => {
          setTask("");
          setTrack("");
          setShowMain("");
          setShowTrackOverlay(false);
          closeModal();
        })
    );
  };

  return (
    <>
      <div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={openModal}
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Action
        </button>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => {}}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Schedule Action
                  </Dialog.Title>
                  {/* <div className="mt-2">
                    <TrackOverlay
                      setTrack={setTrack}
                      showTrackOverlay={showTrackOverlay}
                      setShowTrackOverlay={setShowTrackOverlay}
                    />
                  </div> */}
                  {/* <TaskDate
                    setTaskDate={setTaskDate}
                    showTaskDate={showTaskDate}
                    setShowTaskDate={setShowTaskDate}
                  /> */}
                  <div className="mt-4 mb-4 grid grid-cols-2 gap-4">
                    {/* <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Start time (optional)"
                      value={startValue}
                      onChange={(newValue) => {
                        setStartValue(newValue);
                        setTaskStartDate(newValue.format());
                      }}
                    />

                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="End time (optional)"
                      value={endValue}
                      onChange={(newValue) => {
                        setEndValue(newValue);
                        setTaskEndDate(newValue.format());
                      }}
                      onClick={() => {
                        logClick("taskEndDateClick");
                      }}
                    /> */}
                  </div>
                  <div className="flex flex-col">
                    <input
                      className="mt-3 w-full p-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out"
                      data-testid="add-task-content"
                      type="text"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      onKeyDown={handleKeypress}
                      placeholder="Action name"
                    />
                  </div>

                  {/* <span
                    className="add-task__project"
                    data-testid="show-track-overlay"
                    onClick={() => {
                      setShowTrackOverlay(!showTrackOverlay);
                    }}
                  >
                    <FaRegListAlt />
                  </span> */}
                  {/* <span
                    className="add-task__date"
                    data-testid="show-task-date-overlay"
                    onClick={() => {
                      setShowTaskDate(!showTaskDate);
                    }}
                  >
                    <FaRegCalendarAlt />
                  </span> */}

                  <div className="mt-4 grid grid-cols-2">
                    <button
                      type="button"
                      className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                      onClick={addTask}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
};
