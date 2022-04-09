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
  const [active, setActive] = useState('inbox');

  const logClick = (event) => {
    let userId = auth.currentUser.uid;
    amplitude.getInstance().logEvent(event, userId);
  }

  return (
    <div className="sidebar" data-testid="sidebar">
      <ul className="sidebar__generic">
        <li
          data-testid="next_7"
          className={active === 'next_7' ? 'active' : undefined}
          onClick={() => {
            setActive('next_7');
            setSelectedTrack('NEXT_7');
            logClick('sideBarCalendarClick');
            setIsRoutine(false);
          }}
        >
          <span>
            <FaRegCalendar />
          </span>
          <span>Daily Schedule</span>
        </li>
        <li
          data-testid="inbox"
          className={active === 'inbox' ? 'active' : undefined}
          onClick={() => {
            setActive('inbox');
            setSelectedTrack('INBOX');
            logClick('sideBarInboxClick');
            setIsRoutine(false);
          }}
        >
          <span>
            <FaInbox />
          </span>
          <span>Inbox</span>
        </li>
        <li
          data-testid="today"
          className={active === 'today' ? 'active' : undefined}
          onClick={() => {
            setActive('today');
            setSelectedTrack('TODAY');
            logClick('sideBarTodaysTasksClick');
            setIsRoutine(false);
          }}
        >
          <span>
            <FaCheckSquare />
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
        <span>
          <FaChevronDown
            className={!showTracks ? 'hidden-projects' : undefined}
          />
        </span>
        <h2>Tracks</h2>
      </div>
      <ul className="sidebar__tracks">{showTracks && <Tracks active={active} setActive={setActive}/>}</ul>
      <AddTrack />
      <div
        className="sidebar__middle"
        onClick={() => {
          setShowRoutines(!showRoutines);
          logClick('sideBarShowRoutinesClick');
        }}
      >
        <span>
          <FaChevronDown
            className={!showRoutines ? 'hidden-projects' : undefined}
          />
        </span>
        <h2>Routines</h2>

        </div>
        <ul className="sidebar__tracks">{showRoutines && <Routines active={active} setActive={setActive}/>}</ul>
        <AddRoutine />
      
    </div>
  );
};
