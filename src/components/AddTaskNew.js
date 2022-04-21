import React, {useState, useEffect, Fragment} from "react";
import {FaRegListAlt, FaRegCalendarAlt, FaRegCalendar} from "react-icons/fa";
import moment from "moment";
import {db, auth} from "../firebase";
import {useTracksValue} from "../context/tracks-context";
import {TrackOverlay} from "./TrackOverlay";
import {TaskDate} from "./TaskDate";
import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";
import {amplitude} from "../utilities/amplitude";
import {Transition, Dialog} from "@headlessui/react";
import {PlusIcon} from "@heroicons/react/solid";

export const AddTaskNew = ({
  showAddTaskMain = true,
  shouldShowMain = false,
  showQuickAddTask,
  setShowQuickAddTask,
}) => {
  const {selectedTrack} = useTracksValue();
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
  // Show the second modal for setting the task date and time
  const [showTaskDateMain, setShowTaskDateMain] = useState(false);
  // Show date picker with react-dates
  const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);
  const [value, setValue] = useState("");
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");

  function closeModal() {
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

  const addTask = () => {
    const trackId = track || selectedTrack;
    let collatedDate = "";
    // generate key for this task
    let key = Math.random().toString(36).substring(7);

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
          // need to figure out what to do with this, if its a collated
          // bc we often will be setting start times and end times
          // startDate: taskStartDate,
          // endDate: taskEndDate,
          date: collatedDate || taskDate,
          start: taskStartDate,
          end: taskEndDate,
          userId: user,
          key: key,
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
          Add Task
        </button>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
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
                    Add New Task to {selectedTrack}
                  </Dialog.Title>
                  <div className="mt-2">
                    <TrackOverlay
                      setTrack={setTrack}
                      showTrackOverlay={showTrackOverlay}
                      setShowTrackOverlay={setShowTrackOverlay}
                    />
                  </div>
                  <TaskDate
                    setTaskDate={setTaskDate}
                    showTaskDate={showTaskDate}
                    setShowTaskDate={setShowTaskDate}
                  />
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start Date"
                    value={startValue}
                    onChange={(newValue) => {
                      setStartValue(newValue);
                      setTaskStartDate(newValue.format());
                    }}
                    onClick={() => {
                      logClick("taskStartDateClick");
                    }}
                  />
                  <input
                    className="add-task__content"
                    data-testid="add-task-content"
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="End Date"
                    value={endValue}
                    onChange={(newValue) => {
                      setEndValue(newValue);
                      setTaskEndDate(newValue.format());
                    }}
                    onClick={() => {
                      logClick("taskEndDateClick");
                    }}
                  />
                  <span
                    className="add-task__project"
                    data-testid="show-track-overlay"
                    onClick={() => {
                      setShowTrackOverlay(!showTrackOverlay);
                    }}
                  >
                    <FaRegListAlt />
                  </span>
                  <span
                    className="add-task__date"
                    data-testid="show-task-date-overlay"
                    onClick={() => {
                      setShowTaskDate(!showTaskDate);
                    }}
                  >
                    <FaRegCalendarAlt />
                  </span>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={addTask}
                    >
                      Add Task
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
