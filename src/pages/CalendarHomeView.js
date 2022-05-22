import React, {useState, useEffect} from "react";
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
import {CalendarHome} from "../components/layout/CalendarHome";
import {useParams} from "react-router-dom";
import {PlusSmIcon as PlusSmIconOutline} from "@heroicons/react/outline";
import {AddEvent} from "../components/functional/AddEvent";

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const CalendarHomeView = () => {
  let {year, month, day} = useParams();
  // This is a global state provided by loading Context
  const {loading, setLoading} = useLoadingValue();
  const [userLoading, setUserLoading] = useState(false);
  const {userData, setUserData, setDisplayName, setPhotoUrl} =
    useLoadingValue();
  const [showBanner, setShowBanner] = useState(false);
  const [isOpenEventModal, setIsOpenEventModal] = useState(false);
  // const {tracksLoading, setTracksLoading} = useLoadingValue();

  // if the user isnt signed in send them back to login page
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });
  }, []);

  // PRE LOADING USER DATA
  useEffect(() => {
    let tasksMapToTrackId = {};

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
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
              tasksMapToTrackId[task.trackId].push(task);
            });
          })
          .then(() => {
            setUserData(tasksMapToTrackId);
            setLoading(false);
            console.log("Finished pre-loading.", tasksMapToTrackId);
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
          <div className="relative" id="content">
            <Sidebar />
            {/* routes */}

            <CalendarHome
              year={year}
              month={month}
              day={day}
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
