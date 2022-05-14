import React, {useState, useEffect} from "react";
import {useTracksValue} from "../../context/tracks-context";
import {db, auth} from "../../firebase";

export function RoutinePicker({showRoutinesList, setSelectedRoutine, setShowRoutinesList}) {
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
      id="modal"
      className={
        showRoutinesList
          ? "cursor-default z-50 absolute inline-block max-w-md p-3 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-visible w-72 top-48 left-64"
          : "hidden"
      }
    >
      <div className="flex flex-col gap-3">
        {tracks.map((track) => (
          <div key={track.id}>
            <div className="cursor-pointer flex p-2 justify-between rounded-md hover:bg-gray-100" onClick={
                () => {
                    setSelectedRoutine(track);
                    setShowRoutinesList(false);
                }
            }>
              <div className="flex-1">
                <p className="text-gray-700 text-sm font-medium">
                  {track.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
