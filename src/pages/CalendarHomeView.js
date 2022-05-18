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

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const CalendarHomeView = () => {
  let {year, month, day} = useParams();
  // This is a global state provided by loading Context
  const {loading, setLoading} = useLoadingValue();
  const [userLoading, setUserLoading] = useState(true);
  const {setDisplayName, setPhotoUrl} = useLoadingValue();
  const [showBanner, setShowBanner] = useState(false);
  // const {tracksLoading, setTracksLoading} = useLoadingValue();

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
        <div className="overflow-x-hidden">
          {showBanner ? <Banner setShowBanner={setShowBanner} /> : null}
          <div className="relative" id="content">
            <Sidebar />
            <CalendarHome year={year} month={month} day={day} />
            <button
              type="button"
              className={
                "z-50 p-3 fixed bottom-3 right-3 inline-flex items-center border border-transparent rounded-full shadow-lg  text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:p-3 sm:left-20 sm:top-1 sm:hidden"
              }
            >
              <PlusSmIconOutline
                className="h-10 w-10 sm:h-7 sm:w-7"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </TracksProvider>
    </LocalizationProvider>
  );
};
