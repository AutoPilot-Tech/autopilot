import React, {Fragment, useEffect, useRef, useState} from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import {BellIcon, MenuIcon, XIcon} from "@heroicons/react/outline";
import {Menu, Transition, Popover, Dialog} from "@headlessui/react";
import {Sidebar} from "./Sidebar";
import {IndividualCalendarRow} from "../functional/IndividualCalendarRow";
import moment from "moment";
import {SmallCalendar} from "../functional/SmallCalendar";
import TextField from "@mui/material/TextField";
import AnimateHeight from "react-animate-height";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// make a unique key
function generateKey() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

const handleKeypress = (e) => {
  //it triggers by pressing the enter key
  if (e.keyCode === 13) {
    addTrack();
    closeModal();
  }
};

export function CalendarHome() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isOpenEventModal, setIsOpenEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [showSmallCalendar, setShowSmallCalendar] = useState(false);
  const [modalSettingOpen, setModalSettingOpen] = useState(false);

  const toggle = () => {
    let modalElement = document.getElementById("modal");
    let saveButtonElement = document.getElementById("save-button");

    // animate the height change in the modal
    if (modalSettingOpen === false) {
      let modalHeight = modalElement.clientHeight;
      modalElement.animate(
        [
          {
            height: `${modalHeight}px`,
          },
          {
            height: `${modalHeight + 170}px`,
          },
        ],

        {
          duration: 300,
          fill: "forwards",
        }
      );
      let saveButtonMarginTop = saveButtonElement.style.marginTop;
      saveButtonElement.animate(
        [
          {
            marginTop: `${saveButtonMarginTop}`,
          },
          {
            marginTop: `${saveButtonMarginTop + 170}px`,
          },
        ],
        {
          duration: 300,
          fill: "forwards",
        }
      );

      setModalSettingOpen(true);
    } else {
      let modalHeight = modalElement.clientHeight;
      let saveButtonMarginTop = saveButtonElement.style.marginTop;

      modalElement.animate(
        [
          {
            height: `${modalHeight}px`,
          },
          {
            height: `${modalHeight - 170}px`,
          },
        ],

        {
          duration: 300,
          fill: "forwards",
        }
      );
      saveButtonElement.animate(
        [
          {
            marginTop: `${saveButtonMarginTop}`,
          },
          {
            marginTop: 0,
          },
        ],
        {
          duration: 300,
          fill: "forwards",
        }
      );
      setModalSettingOpen(false);
    }
  };

  function closeModal() {
    setIsOpenEventModal(false);
  }

  function openModal() {
    setIsOpenEventModal(true);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="relative z-20 flex flex-none items-center justify-between border-b border-gray-200 py-1 px-6">
        <div className="flex items-center gap-x-3">
          <MenuIcon
            className="h-6 w-8 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:cursor-pointer"
            aria-hidden="true"
            onClick={() => {
              setOpenSidebar(true);
            }}
          />
          <a className="" href="/dashboard">
            <img
              className="block w-auto h-14"
              src="../../images/autopilot_alpha.png"
              alt="Autopilot"
            />
          </a>
        </div>
        <div className="flex">
          <h1 className="text-lg font-semibold text-gray-900 mr-2">
            <time className="sm:hidden">Jan 22, 2022</time>
            <time className="hidden sm:inline">January 22, 2022</time>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Saturday</p>
        </div>
        <div className="flex items-center">
          <div className="flex items-center rounded-md shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Day view
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Menu.Item>
                      {({active}) => (
                        <a
                          href="/calendar/home"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({active}) => (
                        <a
                          href="/calendar/week"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({active}) => (
                        <a
                          href="/calendar/month"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      <div className="flex flex-auto overflow-hidden bg-white">
        <Transition appear show={isOpenEventModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 " />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  id="modal"
                  className="inline-block w-full max-w-md p-3 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                >
                  {/* <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    New Event
                  </Dialog.Title> */}
                  <div className="flex flex-col mb-4 gap-3 content-between">
                    <TextField
                      className="mt-3 w-full  text-gray-900 placeholder-gray-500 focus:rounded-md focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out border-0 border-b border-gray-300"
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="Add title"
                      onKeyDown={(e) => handleKeypress(e)}
                      variant="standard"
                    />
                    <div className="flex flex-row gap-3">
                      <div
                        onClick={() => {
                          setShowSmallCalendar(!showSmallCalendar);
                          toggle();
                        }}
                      >
                        <p className="p-0.5 border-b border-b-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100">
                          Date
                        </p>
                      </div>

                      <SmallCalendar
                        setModalSettingOpen={setModalSettingOpen}
                        showSmallCalendar={showSmallCalendar}
                        setShowSmallCalendar={setShowSmallCalendar}
                      />
                      <div>
                        <p className="p-0.5 border-b border-b-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100">
                          Initial Time
                        </p>
                      </div>
                      <div>
                        <p className="p-0.5 border-b border-b-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100">
                          Final Time
                        </p>
                      </div>
                      <div>
                        <p className="p-0.5 border-b border-b-gray-300 cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100">
                          Routine
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        id="save-button"
                        type="button"
                        className=" inline-flex px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        <div className="flex flex-auto flex-col overflow-auto">
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{gridTemplateRows: "repeat(48, minmax(1.5rem, 1fr))"}}
              >
                <div className="row-end-1 h-7"></div>
                {/* render <IndividualCalendarRow /> 23 times. */}
                {[...Array(24)].map((_, i) => (
                  <React.Fragment key={generateKey()}>
                    <IndividualCalendarRow time={i} />
                    <div />
                  </React.Fragment>
                ))}
              </div>

              {/* Events grid */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                // onClick={() => {
                //     alert('Clicked a row');
                // }}
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                {/* render 24 clickable rows */}
                {[...Array(24)].map((_, i) => (
                  <li
                    className="z-0 relative mt-px flex opacity-0"
                    style={{
                      gridRow: `${i * 12 + 2} / span 12`,
                      gridColumn: `1 / span 1`,
                    }}
                    key={generateKey()}
                  >
                    <a
                      href="#"
                      onClick={() => setIsOpenEventModal(true)}
                      className="cursor-default group absolute inset-0.5 flex flex-col overflow-y-auto rounded-lg pl-2 pt-1 bg-blue-100"
                    ></a>
                  </li>
                ))}

                {/* Render the individual events */}
                <li
                  className="z-50 relative mt-px flex"
                  style={{gridRow: "74 / span 12", gridColumn: "1 / span 1"}}
                  key={generateKey()}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 pl-2 pt-1 text-xs leading-4 hover:bg-blue-100"
                  >
                    <p className=" font-semibold text-blue-700">Breakfast</p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-22T06:00">6:00 AM - 7:00AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex"
                  style={{gridRow: "92 / span 30", gridColumn: "1 / span 1"}}
                  key={generateKey()}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                  >
                    <p className="order-1 font-semibold text-pink-700">
                      Flight to Paris
                    </p>
                    <p className="order-1 text-pink-500 group-hover:text-pink-700">
                      John F. Kennedy International Airport
                    </p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-22T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex"
                  style={{gridRow: "134 / span 18", gridColumn: "1 / span 1"}}
                  key={generateKey()}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs leading-4 hover:bg-indigo-100"
                  >
                    <p className="font-semibold text-indigo-700">Sightseeing</p>

                    <p className="text-indigo-500 group-hover:text-indigo-700">
                      <time dateTime="2022-01-22T11:00">11:00 AM</time>
                    </p>
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
