import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import AdapterMoment from "@mui/lab/AdapterMoment";
import {LocalizationProvider} from "@mui/lab";
import {Header} from "../components/layout/Header";
import {Content} from "../components/layout/Content";
import {TracksProvider} from "../context/tracks-context";
import {auth, db} from "../firebase";
import SyncLoader from "react-spinners/SyncLoader";
import {useLoadingValue} from "../context/loading-context";
import {Banner} from "../components/layout/Banner";
import {Sidebar} from "../components/layout/Sidebar";
import {Tasks} from "../components/Tasks";
import {AddEvent} from "../components/functional/AddEvent";

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const TaskView = () => {
  const {loading, setLoading} = useLoadingValue();
  const {setDisplayName, setPhotoUrl} = useLoadingValue();
  const [showBanner, setShowBanner] = useState(false);
  const [isOpenEventModal, setIsOpenEventModal] = useState(false);
  const {userData, setUserData} = useLoadingValue();

  const {id} = useParams();
  // const {tracksLoading, setTracksLoading} = useLoadingValue();
  // get user from context

  // if the user isnt signed in send them back to login page
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });
  }, []);

  // PRE LOADING USER DATA IF THE COMPONENT MOUNTS FOR THE FIRST TIME
  useEffect(() => {
    let tasksMapToTrackId = {};
    let trackIdsMapToTrackNames = {};
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // if the user is logged in and has no data
      if (user && userData.length === 0) {
        db.collection("tasks")
          .where("userId", "==", auth.currentUser.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              let task = doc.data();
              // if the trackId doesnt have any tasks, add it to the map
              if (!tasksMapToTrackId[task.trackId]) {
                tasksMapToTrackId[task.trackId] = [];
              }
              if (!trackIdsMapToTrackNames[task.trackId]) {
                trackIdsMapToTrackNames[task.trackId] = [];
              }
              tasksMapToTrackId[task.trackId].push(task);
              trackIdsMapToTrackNames[task.trackId].push(task.routineName);
            });
          })
          .then(() => {
            setUserData({
              tasksMapToTrackId: tasksMapToTrackId,
              trackIdsMapToTrackNames: trackIdsMapToTrackNames,
            });
            setLoading(false);
            console.log("Finished pre-loading.", {
              tasksMapToTrackId: tasksMapToTrackId,
              trackIdsMapToTrackNames: trackIdsMapToTrackNames,
            });
          });
      }
    });
    return unsubscribe;
  }, []);

  return loading ? (
    <div className="grid place-items-center h-screen">
      <SyncLoader loading={true} size={15} speedMultiplier={2} />
    </div>
  ) : (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TracksProvider>
        <Header />
        <div className="overflow-x-hidden">
          {showBanner ? <Banner setShowBanner={setShowBanner} /> : null}
          <div className="relative" id="content">
            <Sidebar />
            <Tasks
              trackId={id}
              isOpenEventModal={isOpenEventModal}
              setIsOpenEventModal={setIsOpenEventModal}
            />
            <AddEvent
              isOpenEventModal={isOpenEventModal}
              setIsOpenEventModal={setIsOpenEventModal}
            />
          </div>
        </div>
      </TracksProvider>
    </LocalizationProvider>
  );
};
