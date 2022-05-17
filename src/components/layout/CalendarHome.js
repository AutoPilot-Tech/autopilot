import React, {Fragment, useEffect, useRef, useState} from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import {MenuIcon} from "@heroicons/react/outline";
import {Menu, Transition, Popover, Dialog} from "@headlessui/react";
import {Sidebar} from "./Sidebar";
import {IndividualCalendarRow} from "../functional/IndividualCalendarRow";
import moment from "moment";
import {SmallCalendar} from "../functional/SmallCalendar";
import TextField from "@mui/material/TextField";
import {RoutinePicker} from "../functional/RoutinePicker";
import {auth, db} from "../../firebase";
import {useTracksValue} from "../../context/tracks-context";
import {AddEvent} from "../functional/AddEvent";
import {useCalendarValue} from "../../context/calendar-context";
import {useTasks} from "../../hooks/index";
import {getTasksLength} from "../../helpers/index";
import {translateRect} from "@fullcalendar/react";

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

export function CalendarHome({year, month, day}) {
  const {openSideBar, setOpenSideBar, nowValue, setNowValue} = useTracksValue();
  const [isOpenEventModal, setIsOpenEventModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [showSmallCalendar, setShowSmallCalendar] = useState(false);
  const [modalSettingOpen, setModalSettingOpen] = useState(false);
  const [routineSetterOpen, setRoutineSetterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("MM-DD-YYYY")
  );
  const modalSettingButtonRef = useRef(null);
  const routinePickerButtonRef = useRef(null);
  const [gridRowClicked, setGridRowClicked] = useState("");
  const [showRoutinesList, setShowRoutinesList] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);

  useEffect(() => {
    // if year month or day are -1, set to today
    if (year != undefined || month != undefined || day != undefined) {
      setNowValue(moment(`${year}-${month}-${day}`));
    }
  }, []);

  useEffect(() => {
    // if the user is signed in
    auth.onAuthStateChanged((user) => {
      if (user) {
        let unsubscribe = db
          .collection("users")
          .doc(auth.currentUser.uid)
          .collection("events")
          .onSnapshot((snapshot) => {
            let eventsArray = [];
            snapshot.forEach((doc) => {
              let event = doc.data();
              event.id = doc.id;
              // if the event is scheduled for today push it
              if (
                moment(event.start).format("MM-DD-YYYY") ===
                moment(nowValue).format("MM-DD-YYYY")
              ) {
                eventsArray.push(event);
              }
            });
            setTodaysEvents(eventsArray);
          });
        return () => {
          unsubscribe();
        };
      }
    });
  }, [nowValue]);

  function closeModal() {
    setIsOpenEventModal(false);
  }

  function openModal() {
    setIsOpenEventModal(true);
  }

  function addEvent() {
    const userId = auth.currentUser.uid;
    // use date and time to make a moment object
    const startTime = moment()
      .hour((gridRowClicked - 2) / 12)
      .minute(0)
      .format("h:mm A");
    const endTime = moment()
      .hour((gridRowClicked - 2) / 12 + 1)
      .minute(0)
      .format("h:mm A");
    const dateTimeStart = moment(selectedDate + " " + startTime).format();
    const dateTimeEnd = moment(selectedDate + " " + endTime).format();

    db.collection("users").doc(auth.currentUser.uid).collection("events").add({
      archived: false,
      routineId: selectedRoutine.trackId,
      title: eventName,
      start: dateTimeStart,
      end: dateTimeEnd,
      userId: userId,
      maintenanceRequired: false,
      gridRow: gridRowClicked,
      span: 12,
      textColor: "text-blue-500",
      bgColor: "bg-blue-50",
      key: generateKey(),
    });

    const tasksLength = db
      .collection("tasks")
      .where("trackId", "==", selectedRoutine.trackId)
      .get()
      .then(function (querySnapshot) {
        return querySnapshot.size;
      })
      .then((tasksLength) => {
        db.collection("tasks").add({
          archived: false,
          trackId: selectedRoutine.trackId,
          title: eventName,
          task: eventName,
          date: selectedDate,
          startTime: startTime,
          endTime: endTime,
          index: tasksLength,
          userId: auth.currentUser.uid,
        });
      });
  }

  return (
    <div
      className={
        openSideBar
          ? "transform transition ease-in-out delay-75 absolute w-full flex flex-row translate-x-72 "
          : "transform transition ease-in-out delay-75 flex flex-row"
      }
    >
      <AddEvent
        setIsOpenEventModal={setIsOpenEventModal}
        isOpenEventModal={isOpenEventModal}
      />
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-auto overflow-hidden bg-white">
          <Transition appear show={isOpenEventModal} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-50 overflow-y-auto overflow-visible"
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
                    className="inline-block w-full max-w-md p-3 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-visible"
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
                        id="event-name"
                        inputProps={{
                          style: {
                            padding: "0.5rem",
                            ":focus": {
                              outline: "none",
                            },
                          },
                        }}
                      />
                      <div className="flex flex-col gap-3">
                        <div className="cursor-pointer flex flex-row items-center gap-2 border-b border-b-gray-300 w-32 hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div
                            onClick={() => {
                              setShowSmallCalendar(!showSmallCalendar);
                              setModalSettingOpen(!modalSettingOpen);
                            }}
                            ref={modalSettingButtonRef}
                          >
                            <p className="select-none p-0.5 hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100 text-gray-600 w-24">
                              {moment(selectedDate).format("MM-DD-YYYY")}
                            </p>
                          </div>
                        </div>

                        <SmallCalendar
                          //   The key is required to update the calendar when the selected date changes.
                          key={modalSettingOpen}
                          modalSettingOpen={modalSettingOpen}
                          setModalSettingOpen={setModalSettingOpen}
                          showSmallCalendar={showSmallCalendar}
                          setShowSmallCalendar={setShowSmallCalendar}
                          setSelectedDate={setSelectedDate}
                          modalSettingButtonRef={modalSettingButtonRef}
                        />
                        <div className="flex flex-row items-center gap-2 border-b border-b-gray-300 w-56">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <p
                              id="time-suggestion"
                              className="select-none p-0.5 cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100 text-gray-600"
                            >
                              {moment()
                                .hour((gridRowClicked - 2) / 12)
                                .minute(0)
                                .format("h:mm A")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-300">-</p>
                          </div>
                          <div>
                            <p
                              id="time-sugggestion"
                              className="p-0.5 select-none cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100 text-gray-600"
                            >
                              {moment()
                                .hour((gridRowClicked - 2) / 12 + 1)
                                .minute(0)
                                .format("h:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* id="save-button" was originally on the button element but i needed to add more layout, and since i was already targetting this id somewhere, i just gave the id to the div */}
                      <div
                        id="save-button"
                        className="flex flex-row gap-2 justify-end items-center"
                      >
                        <div
                          className="cursor-pointer flex flex-row items-center gap-2 border-b border-b-gray-300 w-32 hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100"
                          ref={routinePickerButtonRef}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path
                              fillRule="evenodd"
                              d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div
                            onClick={() => {
                              setShowRoutinesList(!showRoutinesList);
                              setRoutineSetterOpen(!routineSetterOpen);
                            }}
                          >
                            <p className=" p-0.5 hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100 text-gray-600 w-24">
                              {selectedRoutine
                                ? selectedRoutine.name
                                : "Set Routine"}
                            </p>
                          </div>
                        </div>
                        <RoutinePicker
                          showRoutinesList={showRoutinesList}
                          setSelectedRoutine={setSelectedRoutine}
                          setShowRoutinesList={setShowRoutinesList}
                          routinePickerButtonRef={routinePickerButtonRef}
                          routineSetterOpen={routineSetterOpen}
                          setRoutineSetterOpen={setRoutineSetterOpen}
                        />
                        <button
                          type="button"
                          className=" inline-flex px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                          onClick={() => {
                            addEvent();
                            closeModal();
                          }}
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
              <div
                className="w-14 flex-none bg-white "
                style={{
                  borderRight: "1px solid #f3f4f6",
                }}
              />
              <div className="grid flex-auto grid-cols-1 grid-rows-1">
                {/* Horizontal lines */}
                <div
                  className="col-start-1 col-end-2 row-start-1 grid"
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
                    gridTemplateRows:
                      "1.75rem repeat(288, minmax(0, 1fr)) auto",
                  }}
                >
                  {/* render 24 clickable rows */}
                  {[...Array(24)].map((_, i) => {
                    let borderTopVal = i === 0 ? "1px solid #f3f4f6" : "none";
                    return (
                      <li
                        className="z-0 relative mt-px flex opacity-"
                        style={{
                          gridRow: `${i * 12 + 2} / span 12`,
                          gridColumn: `1 / span 1`,
                          borderTop: borderTopVal,
                          borderBottom: "1px solid #f3f4f6",
                        }}
                        key={generateKey()}
                      >
                        <a
                          href="#"
                          onClick={() => {
                            setGridRowClicked(i * 12 + 2);
                            setIsOpenEventModal(true);
                          }}
                          className="cursor-pointer group absolute inset-0.5 flex flex-col overflow-y-auto rounded-lg pl-2 pt-1 bg-transparent"
                        ></a>
                      </li>
                    );
                  })}

                  {/* Render the individual events */}
                  {todaysEvents.map((block) => (
                    <li
                      className="relative mt-px flex z-40"
                      style={{
                        gridRow: `${block.gridRow} / span 12`,
                        gridColumn: "1 / span 1",
                      }}
                      key={block.key}
                    >
                      <a
                        href="#"
                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 pl-2 pt-1 text-xs leading-4 hover:bg-blue-100"
                      >
                        <p className=" font-semibold text-blue-700">{`${block.title}`}</p>
                        <p className="text-blue-500 group-hover:text-blue-700">
                          <time dateTime="2022-01-22T06:00">{`${moment(
                            block.start
                          ).format("h:mm A")}`}</time>
                        </p>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
