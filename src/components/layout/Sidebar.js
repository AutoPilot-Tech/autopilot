import React, {useState} from "react";
import {Routines} from "../Routines";
import {useTracksValue} from "../../context/tracks-context";
import {useLoadingValue} from "../../context/loading-context";
import {amplitude} from "../../utilities/amplitude";
import {auth} from "../../firebase";
import {AddRoutine} from "../AddRoutine";
import {Link, Navigate} from "react-router-dom";
import {useNavigate} from "react-router-dom";

export const Sidebar = () => {
  let navigate = useNavigate();

  const {setSelectedTrack, setIsRoutine} = useTracksValue();
  const {openSideBar, setOpenSideBar} = useLoadingValue();
  const [showTracks, setShowTracks] = useState(true);
  const [active, setActive] = useState("calendar");

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <nav
      className={
        openSideBar
          ? "transform transition ease-in-out duration-75 space-y-1 float-left flex flex-col pl-6 pt-2 h-screen w-72 bg-white border-r-2 border-slate-100 "
          : "flex flex-col float-left space-y-1 absolute pl-6 pt-2 h-screen w-72 bg-white border-r-2 border-slate-100 "
      }
    >
      <ul className="pt-2 pr-1">
        <li
          className={classNames(
            active === "calendar"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "flex items-center px-2 py-1.5 font-medium rounded-md cursor-pointer text-sm subpixel-antialiased"
          )}
          onClick={() => {
            logClick("sideBarCalendarClick");
            setActive("calendar");
            setSelectedTrack("CALENDAR");
            setIsRoutine(false);
            // navigate to /app/calendar/home
            navigate("/app/calendar/home");
          }}
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-rose-500 hover:fill-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </span>
          <span>For You</span>
        </li>
        <li
          className={classNames(
            active === "inbox"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "flex items-center px-2 py-1.5 font-medium rounded-md cursor-pointer text-sm subpixel-antialiased"
          )}
          onClick={() => {
            setActive("inbox");
            setSelectedTrack("INBOX");
            logClick("sideBarInboxClick");
            setIsRoutine(false);
            // if the current route does not contain tasks, navigate
            // to /app/inbox/home
            navigate(`/app/tasks/INBOX`);
          }}
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </span>
          <span>Inbox</span>
        </li>
        {/* <li
          className={classNames(
            active === "today"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "flex items-center px-2 py-1.5 font-medium rounded-md cursor-pointer text-sm subpixel-antialiased"
          )}
          onClick={() => {
            setActive("today");
            setSelectedTrack("TODAY");
            logClick("sideBarTodaysTasksClick");
            setIsRoutine(false);
          }}
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span>Today</span>
        </li> */}
        {/* <li
          data-testid="today"
          className={classNames(
            active === "Settings"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "flex items-center px-2 py-1.5 font-medium rounded-md cursor-pointer text-sm subpixel-antialiased"
          )}
          onClick={() => {
            setActive("Settings");
            setSelectedTrack("SETTINGS");
            logClick("sideBarClickSettings");
            setIsRoutine(false);
            window.location.assign(`/app/tasks/SETTINGS`);
          }}
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </span>
          <span>Autopilot Settings</span>
        </li> */}
      </ul>
      <div>
        <div className="grid grid-cols-2 mt-5 mb-2 pr-1">
          <p className="pl-2 float-left text-gray-400 font-medium">Routines</p>
          <AddRoutine />
        </div>
      </div>
      <ul>{<Routines active={active} setActive={setActive} />}</ul>
    </nav>
  );
};
