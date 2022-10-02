import {left} from "@popperjs/core";
import React, {useState, useEffect, useRef} from "react";
import {useTracksValue} from "../../context/tracks-context";
import {db, auth} from "../../firebase";
import {AddRoutine} from "../AddRoutine";
import {getRandomColor} from "../../helpers/index";
import {generatePushId} from "../../helpers/index";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref,
  showRoutinesList,
  setShowRoutinesList,
  routinePickerButtonRef,
  routineSetterOpen,
  setRoutineSetterOpen
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        showRoutinesList &&
        !routinePickerButtonRef.current.contains(event.target)
      ) {
        setShowRoutinesList(false);
        setRoutineSetterOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(
    wrapperRef,
    props.showRoutinesList,
    props.setShowRoutinesList,
    props.routinePickerButtonRef,
    props.routineSetterOpen,
    props.setRoutineSetterOpen
  );

  return <div ref={wrapperRef}>{props.children}</div>;
}

export function RoutinePicker({
  showRoutinesList,
  setSelectedRoutine,
  setShowRoutinesList,
  routinePickerButtonRef,
  routineSetterOpen,
  setRoutineSetterOpen,
}) {
  const {tracks, setTracks} = useTracksValue();
  const [routines, setRoutines] = useState([]);
  const [routineCreator, setRoutineCreator] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  useEffect(() => {
    const userId = auth.currentUser.uid;
    const unsubscribe = db
      .collection("tracks")
      .where("userId", "==", userId)
      .onSnapshot((snapshot) => {
        const newTracks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoutines(newTracks);
      });
    return () => unsubscribe();
  }, []);

  const addTrack = () => {
    const trackId = generatePushId();
    let trackColor = getRandomColor();
    newRoutineName &&
      db
        .collection("tracks")
        .add({
          trackId,
          name: newRoutineName,
          userId: auth.currentUser.uid,
          routine: false,
          textColor: `text-${trackColor}-500`,
          bgColor: `bg-${trackColor}-50`,
        })
        .then(() => {
          tracks.push({
            trackId,
            name: newRoutineName,
            userId: auth.currentUser.uid,
            routine: false,
            color: trackColor,
          });
          setTracks([...tracks]);
          setNewRoutineName("");
        });
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      addTrack();
    }
  };

  return (
    <div
      className={
        showRoutinesList
          ? "cursor-default z-50 w-40 top-48 left-28 absolute inline-block max-w-md p-3 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-visible sm:w-72 sm:top-48 sm:left-64"
          : "hidden"
      }
    >
      <OutsideAlerter
        showRoutinesList={true}
        setShowRoutinesList={setShowRoutinesList}
        routinePickerButtonRef={routinePickerButtonRef}
        setRoutineSetterOpen={setRoutineSetterOpen}
        routineSetterOpen={routineSetterOpen}
      >
        <div className="flex flex-col gap-3">
          {tracks.length === 0 ? (
            <div className="text-center flex-col flex">
              {routineCreator ? (
                <>
                  <h4 className="text-md font-medium leading-6 text-gray-900">
                    New Routine
                  </h4>
                  <div className="flex flex-col">
                    <input
                      className="mt-3 w-full p-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out"
                      type="text"
                      value={newRoutineName}
                      onChange={(e) => setNewRoutineName(e.target.value)}
                      placeholder="Routine Name"
                      onKeyDown={(e) => handleKeypress(e)}
                    />
                    <div className="mt-4 grid grid-cols-2">
                      <button
                        type="button"
                        className="m-auto inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={() => setShowRoutinesList(false)}
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
                </>
              ) : (
                <div className="text-gray-500">
                  <p>You don't have any routines yet.</p>
                  <br />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      setRoutineCreator(true);
                    }}
                  >
                    Add one
                  </button>
                </div>
              )}
            </div>
          ) : (
            tracks.map((track) => (
              <div key={track.id}>
                <div
                  className="cursor-pointer flex p-2 justify-between rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setSelectedRoutine(track);
                    setShowRoutinesList(false);
                  }}
                >
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm font-medium">
                      {track.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          {tracks && tracks.length > 0 && (
            <div>
              <div
                className="cursor-pointer flex p-2 justify-between rounded-md hover:bg-gray-100"
                onClick={() => {
                  setSelectedRoutine({name: "Inbox", trackId: "INBOX"});
                  setShowRoutinesList(false);
                }}
              >
                <div className="flex-1">
                  <p className="text-gray-700 text-sm font-medium">{"Inbox"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </OutsideAlerter>
    </div>
  );
}
