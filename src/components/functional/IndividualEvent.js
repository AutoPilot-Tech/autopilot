import React from 'react'

export function IndividualEvent({gridRowStart, gridRowSpan, gridColumnStart, gridColumnSpan}) {
  return (
    <>
      <li
        className="z-50 relative mt-px flex"
        style={{gridRow: `${gridRowStart} / span ${gridRowSpan} `, gridColumn: `${gridColumnStart} / span ${gridColumnSpan}`}}
        >
          <a href="#"
          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 pl-2 pt-1 text-xs leading-4 hover:bg-blue-100"
          >
            <p className=" font-semibold text-blue-700">Breakfast</p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-22T06:00">6:00 AM - 7:00AM</time>
                    </p>
          </a>
        </li>
    </>
  )
}
