import React, { useState } from 'react';
import { FaMoon, FaUserAlt } from 'react-icons/fa';
import { AddTask } from '../AddTask';

export const Header = ({ darkMode, setDarkMode }) => {
  const [shouldShowMain, setShouldShowMain] = useState(false);
  const [showQuickAddTask, setShowQuickAddTask] = useState(false);

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
            <li className="settings__user" data-testid="user-action">
              <FaUserAlt />
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
