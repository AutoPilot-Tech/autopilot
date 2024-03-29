import {Fragment, useEffect, useRef, useState} from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import {Menu, Transition} from "@headlessui/react";
import moment from "moment";
import {useAutoFill} from "../hooks";
import {auth, db} from "../firebase";
import {useTracksValue} from "../context/tracks-context";
import {generatePushId} from "../helpers";
import {CurrentTasks} from "./CurrentTasks";
import {WelcomeBack} from "./WelcomeBack";
import {CreateAction} from "./CreateAction";
import {Scrollbars} from "react-custom-scrollbars";

const days = [
  {date: "2021-12-27"},
  {date: "2021-12-28"},
  {date: "2021-12-29"},
  {date: "2021-12-30"},
  {date: "2021-12-31"},
  {date: "2022-01-01", isCurrentMonth: true},
  {date: "2022-01-02", isCurrentMonth: true},
  {date: "2022-01-03", isCurrentMonth: true},
  {date: "2022-01-04", isCurrentMonth: true},
  {date: "2022-01-05", isCurrentMonth: true},
  {date: "2022-01-06", isCurrentMonth: true},
  {date: "2022-01-07", isCurrentMonth: true},
  {date: "2022-01-08", isCurrentMonth: true},
  {date: "2022-01-09", isCurrentMonth: true},
  {date: "2022-01-10", isCurrentMonth: true},
  {date: "2022-01-11", isCurrentMonth: true},
  {date: "2022-01-12", isCurrentMonth: true, isToday: true},
  {date: "2022-01-13", isCurrentMonth: true},
  {date: "2022-01-14", isCurrentMonth: true},
  {date: "2022-01-15", isCurrentMonth: true},
  {date: "2022-01-16", isCurrentMonth: true},
  {date: "2022-01-17", isCurrentMonth: true},
  {date: "2022-01-18", isCurrentMonth: true},
  {date: "2022-01-19", isCurrentMonth: true},
  {date: "2022-01-20", isCurrentMonth: true},
  {date: "2022-01-21", isCurrentMonth: true},
  {date: "2022-01-22", isCurrentMonth: true, isSelected: true},
  {date: "2022-01-23", isCurrentMonth: true},
  {date: "2022-01-24", isCurrentMonth: true},
  {date: "2022-01-25", isCurrentMonth: true},
  {date: "2022-01-26", isCurrentMonth: true},
  {date: "2022-01-27", isCurrentMonth: true},
  {date: "2022-01-28", isCurrentMonth: true},
  {date: "2022-01-29", isCurrentMonth: true},
  {date: "2022-01-30", isCurrentMonth: true},
  {date: "2022-01-31", isCurrentMonth: true},
  {date: "2022-02-01"},
  {date: "2022-02-02"},
  {date: "2022-02-03"},
  {date: "2022-02-04"},
  {date: "2022-02-05"},
  {date: "2022-02-06"},
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Calendar() {
  const {events, setEvents} = useTracksValue();
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);
  const [todaysEvents, setTodaysEvents] = useState("");
  const [loading, setLoading] = useState(true);
  const [autoEvents, setAutoEvents] = useState([]);
  const {tracks, setTracks} = useTracksValue();

  // function that deletes an event
  const deleteEvent = (key) => {
    const newEvents = events.filter((event) => event.key !== key);
    setTodaysEvents(newEvents);
    setEvents(newEvents);
  };

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60;
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }, []);

  useEffect(() => {
    let unsubscribe = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("events")
      .onSnapshot((snapshot) => {
        let eventsArray = [];
        snapshot.forEach((doc) => {
          let event = doc.data();
          event.id = doc.id;
          eventsArray.push(event);
        });
        setTodaysEvents(eventsArray);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (todaysEvents.length > 0) {
      setLoading(false);
      console.log(todaysEvents);
    }
  }, [todaysEvents]);

  return (
    <div className="flex flex-col pt-2 mr-8 ml-80">
      <WelcomeBack />
      <header className="relative flex flex-none items-center justify-between border-b border-gray-200 py-4 px-6">
        <div>
          <h1 className="text-lg font-semibold leading-6 text-gray-900">
            <time className="sm:hidden">{moment().format("MMM D YYYY")}</time>
            <time className="hidden sm:inline">
              {moment().format("MMMM D, YYYY")}
            </time>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {moment().format("dddd")}
          </p>
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
            {/* <div className="ml-6 h-6 w-px bg-gray-300" /> */}
            {/* <button
              type="button"
              className="focus:outline-none ml-6 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add event
            </button> */}
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
                        Today Day view
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
      <Scrollbars
        autoHeight
        autoHeightMin={0}
        // see all of the content
        autoHeightMax={"100vh"}
        // renderTrackVertical={props => <div {...props} className="track-vertical"/>}
        // renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
      >
        <div className="flex flex-auto bg-white">
          <div
            ref={container}
            className="flex flex-auto flex-col overflow-auto"
          >
            <div
              ref={containerNav}
              className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
            >
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>W</span>
                {/* Default: "text-gray-900", Selected: "bg-gray-900 text-white", Today (Not Selected): "text-indigo-600", Today (Selected): "bg-indigo-600 text-white" */}
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
                  19
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>T</span>
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-indigo-600">
                  20
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>F</span>
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
                  21
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>S</span>
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-base font-semibold text-white">
                  22
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>S</span>
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
                  23
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>M</span>
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
                  24
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-3 pb-1.5"
              >
                <span>T</span>
                <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900">
                  25
                </span>
              </button>
            </div>
            <div className="flex w-full flex-auto overscroll-auto">
              <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
              <div className="grid flex-auto grid-cols-1 grid-rows-1">
                {/* Horizontal lines */}
                <div
                  className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                  style={{gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))"}}
                >
                  <div ref={containerOffset} className="row-end-1 h-7"></div>
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      12AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      1AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      2AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      3AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      4AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      5AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      6AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      7AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      8AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      9AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      10AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      11AM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      12PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      1PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      2PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      3PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      4PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      5PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      6PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      7PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      8PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      9PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      10PM
                    </div>
                  </div>
                  <div />
                  <div>
                    <div className="sticky left-0 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                      11PM
                    </div>
                  </div>
                  <div />
                </div>

                {/* Routines */}
                <ol
                  className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                  style={{
                    gridTemplateRows:
                      "1.75rem repeat(288, minmax(0, 1fr)) auto",
                  }}
                >
                  {/* <li
                  className="relative mt-px flex"
                  style={{ gridRow: '74 / span 12' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                  >
                    <p className="order-1 font-semibold text-blue-700">
                      Breakfast
                    </p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-22T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li> */}

                  {/* <li
                  className="relative mt-px flex"
                  style={{ gridRow: '92 / span 30' }}
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
                </li> */}
                  {/* <li
                  className="relative mt-px flex"
                  style={{ gridRow: '134 / span 18' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs leading-5 hover:bg-indigo-100"
                  >
                    <p className="order-1 font-semibold text-indigo-700">
                      Sightseeing
                    </p>
                    <p className="order-1 text-indigo-500 group-hover:text-indigo-700">
                      Eiffel Tower
                    </p>
                    <p className="text-indigo-500 group-hover:text-indigo-700">
                      <time dateTime="2022-01-22T11:00">11:00 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex"
                  style={{ gridRow: '206 / span 12' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-indigo-50 p-2 text-xs leading-5 hover:bg-indigo-100"
                  >
                    <p className="order-1 font-semibold text-indigo-700">
                      Sightseeing
                    </p>
                    <p className="order-1 text-indigo-500 group-hover:text-indigo-700">
                      Eiffel Tower
                    </p>
                    <p className="text-indigo-500 group-hover:text-indigo-700">
                      <time dateTime="2022-01-22T11:00">11:00 AM</time>
                    </p>
                  </a>
                </li> */}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Scrollbars>
    </div>
  );
}

// {loading ? (
//   <></>
// ) : (
//   todaysEvents.map((block) => (
//     <li
//       key={block.key}
//       className="relative mt-px flex"
//       style={{
//         gridRow: `${block.gridRow} / span ${block.span}`,
//       }}
//     >
//       <a
//         href="#"
//         className={`group absolute inset-1 flex flex-col overflow-y-auto rounded-lg ${block.bgColor} p-2 text-xs leading-5 hover:bg--100`}
//       >
//         <p
//           className={`order-1 font-semibold ${block.textColor}`}
//         >
//           {block.title}
//         </p>
//         {/* create a delete button on the right top side of the event
//         <button
//           // all the way to the right
//           className="absolute right-0 top-0 mr-2 mt-2"
//           onClick={() => {
//             deleteEvent(block.key);
//           }}
//         >
//           <svg
//             className="h-5 w-5 text-red-500 group-hover:text-red-700"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path
//               fillRule="evenodd"
//               d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button> */}
//         <p
//           className={`${block.textColor} group-hover:${block.textColor}`}
//         >
//           <time dateTime="2022-01-22T${block.startTime}">
//             {block.startTime}
//           </time>
//         </p>
//       </a>
//     </li>
//   ))
// )}
