import React, {useState, useEffect, Fragment} from "react";
import {db, auth} from "../firebase";
import {generatePushId} from "../helpers";
import {useTracksValue} from "../context/tracks-context";
import {amplitude} from "../utilities/amplitude";
import {getRandomColor} from "../helpers/index";
import {PlusIcon} from "@heroicons/react/solid";
import {Transition, Dialog} from "@headlessui/react";

export const AddRoutine = ({shouldShow = false}) => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

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

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      addTrack();
      closeModal();
    }
  };

  const addTrack = () => {
    console.log("Adding routine");
    let trackColor = getRandomColor();
    projectName &&
      db
        .collection("tracks")
        .add({
          trackId,
          name: projectName,
          userId: user,
          routine: false,
          textColor: `text-${trackColor}-500`,
          bgColor: `bg-${trackColor}-50`,
        })
        .then(() => {
          tracks.push({
            trackId,
            name: projectName,
            userId: user,
            routine: false,
            color: trackColor,
          });
          setTracks([...tracks]);
          setProjectName("");
          closeModal();
        });
  };
  return (
    <div className="mr-5 mt-0.5 cursor-pointer">
      <span
        className="p-0 float-right text-gray-400 cursor-pointer  hover:rounded-md hover:text-gray-900 hover:bg-gray-200 text-lg"
        onClick={() => openModal()}
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
          onClose={() => closeModal()}
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

                <div className="flex flex-col">
                  <input
                    className="mt-3 w-full p-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out"
                    data-testid="add-task-content"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Routine Name"
                    onKeyDown={(e) => handleKeypress(e)}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2">
                  <button
                    type="button"
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={() => closeModal()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                    onClick={() => addTrack()}
                  >
                    Add Routine
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
