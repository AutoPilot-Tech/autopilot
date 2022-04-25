import React, {useState, useEffect, Fragment} from "react";
import {db, auth} from "../firebase";
import {generatePushId} from "../helpers";
import {useTracksValue} from "../context/tracks-context";
import {amplitude} from "../utilities/amplitude";
import {getRandomColor} from "../helpers/index";
import {PlusIcon} from "@heroicons/react/solid";
import {Transition, Dialog} from "@headlessui/react";
import DateTimePicker from "@mui/lab/DateTimePicker";
import TextField from "@mui/material/TextField";

export const AddRoutineNew = ({shouldShow = false}) => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [routineName, setRoutineName] = useState("");
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [routineStartDate, setRoutineStartDate] = useState("");
  const [routineEndDate, setRoutineEndDate] = useState("");

  const trackId = generatePushId();
  const {tracks, setTracks} = useTracksValue();

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

  const addTrack = () => {
    let trackColor = getRandomColor();
    routineName &&
      db
        .collection("tracks")
        .add({
          trackId,
          name: routineName,
          userId: user,
          routine: true,
          textColor: `text-${trackColor}-500`,
          bgColor: `bg-${trackColor}-50`,
        })
        .then(() => {
          tracks.push({
            trackId,
            name: routineName,
            userId: user,
            routine: true,
            color: trackColor,
          });
          setTracks([...tracks]);
          setRoutineName("");
          closeModal();
        });
  };
  return (
    <div className="float-right mt-3 mr-4 cursor-pointer">
      <span
        className="text-gray-400 cursor-pointer  hover:rounded-md hover:text-gray-900 hover:bg-gray-200 text-lg"
        onClick={openModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      </span>
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
                  Add New Routine
                </Dialog.Title>

                <div className="mt-4 mb-4 grid grid-cols-2 gap-4">
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start Time"
                    value={startValue}
                    onChange={(newValue) => {
                      setStartValue(newValue);
                      setRoutineStartDate(newValue.format());
                    }}
                  />

                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="End Time"
                    value={endValue}
                    onChange={(newValue) => {
                      setEndValue(newValue);
                      setRoutineEndDate(newValue.format());
                    }}
                    onClick={() => {
                      logClick("taskEndDateClick");
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 mt-2 text-gray-900">
                    Routine Name
                  </label>
                  <input
                    className="add-task__content"
                    data-testid="add-task-content"
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2">
                  <button
                    type="button"
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={addTrack}
                  >
                    Add Project
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
