import React, {useState, useEffect} from "react";
import AdapterMoment from "@mui/lab/AdapterMoment";
import {LocalizationProvider} from "@mui/lab";

import {Header} from "../components/layout/Header";
import {Content} from "../components/layout/Content";
import {TracksProvider, useTracksValue} from "../context/tracks-context";
import {Loading} from "./Loading";
import {auth, db} from "../firebase";
import {Scrollbars} from "react-custom-scrollbars";
import {Footer} from "../components/layout/Footer";
import SyncLoader from "react-spinners/SyncLoader";
import {useLoadingValue} from "../context/loading-context";
import {css} from "@emotion/react";
import {Banner} from "../components/layout/Banner";

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const Dashboard = ({darkModeDefault = true}) => {
  const [darkMode, setDarkMode] = useState(darkModeDefault);
  // const {loading, setLoading} = useLoadingValue();
  const [userLoading, setUserLoading] = useState(true);
  const {setDisplayName, setPhotoUrl} = useLoadingValue();
  const [showBanner, setShowBanner] = useState(true);
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
        setUserLoading(false);
      } else {
        console.log("User is not signed in");
      }
    });
    return unsubscribe;
  }, []);

  return userLoading ? (
    <div className="grid place-items-center h-screen">
      <SyncLoader loading={true} size={15} speedMultiplier={2} />
    </div>
  ) : (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TracksProvider>
        {/* <Scrollbars
          autoHide
          autoHeight
          autoHeightMin={0}
          autoHeightMax={"100vh"}
        > */}
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <div>
            {showBanner ? <Banner setShowBanner={setShowBanner} /> : null}
            <Content />
          </div>
        {/* </Scrollbars> */}
      </TracksProvider>
    </LocalizationProvider>
  );
};
