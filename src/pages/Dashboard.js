import React, {useState, useEffect} from "react";
import AdapterMoment from "@mui/lab/AdapterMoment";
import {LocalizationProvider} from "@mui/lab";

import {Header} from "../components/layout/Header";
import {Content} from "../components/layout/Content";
import {TracksProvider, useTracksValue} from "../context/tracks-context";
import {Loading} from "./Loading";
import {auth} from "../firebase";
import {Scrollbars} from "react-custom-scrollbars";
import {Footer} from "../components/layout/Footer";

// note: see src/context. Since we want to use tracksprovider at the
// top level, we are using it here in App. This can be replaced
// with Redux, later.
export const Dashboard = ({darkModeDefault = true}) => {
  const [darkMode, setDarkMode] = useState(darkModeDefault);
  const [loading, setLoading] = useState(true);
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
        console.log("user logged in", user);

        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    // if loading is true, show loading component
    loading ? (
      <Loading />
    ) : (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <TracksProvider>
          <Scrollbars
            // autoHide
            // autoHideTimeout={1000}
            // autoHideDuration={200}
            autoHeight
            autoHeightMin={0}
            autoHeightMax={"100vh"}
            // renderTrackVertical={props => <div {...props} className="track-vertical"/>}
            // renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
          >
            <div
              data-testid="application"
              className={"flex flex-col min-h-screen flex-grow"}
            >
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />

              <Content />
              <Footer />
            </div>
          </Scrollbars>
        </TracksProvider>
      </LocalizationProvider>
    )
  );
};
