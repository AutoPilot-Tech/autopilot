import React from 'react'

export const DropDown = ({ submenus, showDropDown }) => {
    console.log(showDropDown)
  return (
    <div>
        <ul className={
            
            showDropDown ? '' : 'dropdown--hidden'
        }>
            {submenus.map(submenu => (
                <li key={submenu.title} className="menu-items">
                    <a href="/#">{submenu.title}</a>
                </li>
            ))}
        </ul>
    </div>
  );
};

