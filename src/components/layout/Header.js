import React, { useState } from 'react';
import { FaMoon, FaUserAlt } from 'react-icons/fa';
import { AddTask } from '../AddTask';
import { DropDown } from '../DropDown';
import { userSubmenu } from '../../constants/index';
import { amplitude } from '../../utilities/amplitude';

export const Header = ({ darkMode, setDarkMode }) => {
  const [shouldShowMain, setShouldShowMain] = useState(false);
  const [showQuickAddTask, setShowQuickAddTask] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const logClick = () => {
    amplitude.getInstance().logEvent('quickAddTaskClicked');
  }

  return (
    <header className="header" data-testid="header">
      <nav>
        <div className="logo">
          <img src="../../images/logo.png" alt="Autopilot" />
        </div>
        <div className="settings">
          <ul>
            <li
              className="settings__add"
              data-testid="quick-add-task-action"
              onClick={() => {
                setShowQuickAddTask(true);
                setShouldShowMain(true);
                logClick();
              }}
            >
              +
            </li>
            <li
              className="settings__darkmode"
              data-testid="dark-mode-action"
              onClick={() => {
                setDarkMode(!darkMode);
              }}
            >
              <FaMoon />
            </li>
            {/* This is where they can log out, or go to settings. */}
            <li className="settings__user" data-testid="user-action">
              <FaUserAlt role="button" onClick={() => {
                setShowDropDown(!showDropDown);
              }}/>
              <DropDown submenus={userSubmenu} showDropDown={showDropDown} />

            </li>
          </ul>
        </div>
      </nav>
      <AddTask
        showAddTaskMain={false}
        setShouldShowMain={setShouldShowMain}
        showQuickAddTask={showQuickAddTask}
        setShowQuickAddTask={setShowQuickAddTask}
      />
    </header>
  );
};
