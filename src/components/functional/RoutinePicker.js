import {left} from "@popperjs/core";
import React, {useState, useEffect, useRef} from "react";
import {useTracksValue} from "../../context/tracks-context";
import {db, auth} from "../../firebase";
import {AddRoutine} from "../AddRoutine";

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
  const [tracks, setTracks] = useState([]);
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
        setTracks(newTracks);
      });
    return () => unsubscribe();
  }, []);
  return (
    <div
      className={
        showRoutinesList
          ? "cursor-default z-50 absolute inline-block max-w-md p-3 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-visible w-72 top-48 left-64"
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
              <div className="text-gray-500">
                <p>You don't have any routines yet.</p>
                <br />
                <button
        type="button"
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add one
      </button>
              </div>
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
          {}
        </div>
      </OutsideAlerter>
    </div>
  );
}
