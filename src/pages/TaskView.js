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

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const TaskView = () => {
  const {loading, setLoading} = useLoadingValue();
  const {setDisplayName, setPhotoUrl} = useLoadingValue();
  const [showBanner, setShowBanner] = useState(false);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // get the user's name from db
        setDisplayName(user.displayName);
        setPhotoUrl(user.photoURL);
        // check to see if the user's tracks are loaded
        setLoading(false);
      } else {
        console.log("User is not signed in");
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
        <div>
          {showBanner ? <Banner setShowBanner={setShowBanner} /> : null}
          <div
            className="flex relative grow flex-row justify-between gap-10"
            id="content"
          >
            <Sidebar />
            <Tasks trackId={id}/>
          </div>
        </div>
      </TracksProvider>
    </LocalizationProvider>
  );
};
