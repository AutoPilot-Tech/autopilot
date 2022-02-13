import React from 'react';
import { FaMoon } from 'react-icons/fa'

export const Header = () => {
  return (
    <header className="header" data-testid="header">
      <nav>
        <div className="logo">
          <img src="../../images/logo.png" alt="Autopilot" />
        </div>
          <div className="settings">
            <ul>
              <li className="settings__add" data-testid="quick-add-task-action">+</li>
              <li className="settings__darkmode" data-testid="dark-mode-action">
                <FaMoon />
              </li>
            </ul>
          </div>
      </nav>
    </header>
  );
};
