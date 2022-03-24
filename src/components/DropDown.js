import React from 'react';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';

export const DropDown = ({ submenus, showDropDown }) => {
  console.log(showDropDown);
  // log out the user
  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        // send user back to log in page
        window.location.href = '/login';
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div>
      <ul className={showDropDown ? '' : 'dropdown--hidden'}>
        {submenus.map((submenu) => (
          <li key={submenu.title} className="menu-items">
            {/* if the submenu title is Logout, lets log them out */}
            {submenu.title === 'Logout' ? (
              // log out the user
              <button onClick={logOut}>{submenu.title}</button>
            ) : (
              <a href="/#">{submenu.title}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
