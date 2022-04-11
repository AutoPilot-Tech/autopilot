import React, { useState } from 'react';
import {
  FaChevronDown,
  FaInbox,
  FaCheckSquare,
  FaRegCalendar,
  FaConciergeBell,
  FaCommentDots,
} from 'react-icons/fa';
import { Tracks } from '../Tracks';
import { IndividualTrack } from '../IndividualTrack';
import { AddTrack } from '../AddTrack';
import { useTracksValue } from '../../context/tracks-context';
import { Routines } from '../Routines';
import { AddRoutine } from '../AddRoutine';
import { amplitude } from '../../utilities/amplitude';
import { auth } from '../../firebase';

export const Sidebar = () => {
  const { setSelectedTrack, isRoutine, setIsRoutine } = useTracksValue();
  const [showTracks, setShowTracks] = useState(true);
  const [showRoutines, setShowRoutines] = useState(true);
  const [active, setActive] = useState('next_7');

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <nav className="fixed space-y-1 float-left h-screen flex flex-col pl-3 w-64 shadow pt-20">
      <ul className="sidebar__generic">
        <li
          data-testid="next_7"
          className={classNames(
            active === 'next_7'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'flex items-center px-3 py-2 text-sm font-medium rounded-md'
          )}
          onClick={() => {
            setActive('next_7');
            setSelectedTrack('NEXT_7');
            logClick('sideBarCalendarClick');
            setIsRoutine(false);
          }}
        >
          <span className="mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
          <span>Daily Schedule</span>
        </li>
        <li
          data-testid="inbox"
          className={classNames(
            active === 'inbox'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'flex items-center px-3 py-2 text-sm font-medium rounded-md'
          )}
          onClick={() => {
            setActive('inbox');
            setSelectedTrack('INBOX');
            logClick('sideBarInboxClick');
            setIsRoutine(false);
          }}
        >
          <span className="mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
        <li
          data-testid="today"
          className={classNames(
            active === 'today'
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'flex items-center px-3 py-2 text-sm font-medium rounded-md'
          )}
          onClick={() => {
            setActive('today');
            setSelectedTrack('TODAY');
            logClick('sideBarTodaysTasksClick');
            setIsRoutine(false);
          }}
        >
          <span className="mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          <span>Today's Tasks</span>
        </li>
        {/* <li
          data-testid="assistant"
          className={active === 'assistant' ? 'active' : undefined}
          onClick={() => {
            setActive('assistant');
            setSelectedTrack('ASSISTANT');
          }}
        >
          <span>
            <FaCommentDots />
          </span>
          <span>Your Assistant</span>
        </li> */}
      </ul>
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowTracks(!showTracks);
          logClick('sideBarShowTracksClick');
        }}
      >
        <div>
          <p className="pl-3 pt-3 float-left text-gray-400 font-medium">
            Tracks
          </p>
          <AddTrack />
        </div>
      </div>
      <ul className="sidebar__tracks">
        {<Tracks active={active} setActive={setActive} />}
      </ul>
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowRoutines(!showRoutines);
          logClick('sideBarShowRoutinesClick');
        }}
      >
        <div>
          
          <p className="pl-3 pt-3 float-left text-gray-400 font-medium">
            Routines
          </p>
          <AddRoutine />
        </div>
      </div>
      <ul className="sidebar__tracks">
        {<Routines active={active} setActive={setActive} />}
      </ul>
    </nav>
  );
};
