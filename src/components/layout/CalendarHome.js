import React, {useEffect, useRef, useState} from "react";

import {IndividualCalendarRow} from "../functional/IndividualCalendarRow";
import moment from "moment";

import {auth, db} from "../../firebase";
import {useTracksValue} from "../../context/tracks-context";

import {getGridRowFromTime} from "../../helpers/index";
import {getGridSpanFromTime} from "../../helpers/index";
import {ModalAdd} from "../functional/ModalAdd";
import {generatePushId} from "../../helpers/index";

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

export function CalendarHome({
  year,
  month,
  day,
  isOpenEventModal,
  setIsOpenEventModal,
}) {
  const {openSideBar, setOpenSideBar, nowValue, setNowValue} = useTracksValue();
  const [eventName, setEventName] = useState("");
  const [showSmallCalendar, setShowSmallCalendar] = useState(false);
  const [modalSettingOpen, setModalSettingOpen] = useState(false);
  const [routineSetterOpen, setRoutineSetterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("MM-DD-YYYY")
  );
  const modalSettingButtonRef = useRef(null);
  const routinePickerButtonRef = useRef(null);
  const initialTimePickerButtonRef = useRef(null);
  const finalTimePickerButtonRef = useRef(null);
  const [gridRowClicked, setGridRowClicked] = useState("");
  const [showRoutinesList, setShowRoutinesList] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [showInitialTimePicker, setShowInitialTimePicker] = useState(false);
  const [showFinalTimePicker, setShowFinalTimePicker] = useState(false);
  const [initialTimeValue, setInitialTimeValue] = useState("");
  const [finalTimeValue, setFinalTimeValue] = useState("");
  const [modalInitialTimeValue, setModalInitialTimeValue] = useState(
    moment().format("h:mm a")
  );
  const [modalEndTimeValue, setModalEndTimeValue] = useState(
    moment().add(1, "hour").format("h:mm a")
  );
  const [eventStartTime, setEventStartTime] = useState(moment());
  const [eventEndTime, setEventEndTime] = useState(moment().add(1, "hour"));

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
                  moment(nowValue).format("MM-DD-YYYY") &&
                !event.archived
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

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      addEvent();
      setEventName("");
      closeModal();
    }
  };

  function closeModal() {
    setIsOpenEventModal(false);
  }

  function openModal() {
    setIsOpenEventModal(true);
  }

  function addEvent() {
    console.log("InitialTimeValue", initialTimeValue);
    console.log("FinalTimeValue", finalTimeValue);
    console.log("eventstartTime", eventStartTime);
    console.log("eventEndTime", eventEndTime);
    const userId = auth.currentUser.uid;
    const taskId = generatePushId();
    const eventId = generatePushId();
    // use date and time to make a moment object
    const gridRowForCalendar = getGridRowFromTime(eventStartTime);
    const gridSpanForCalendar = getGridSpanFromTime(
      eventStartTime,
      eventEndTime
    );
    let routineIdForEvent;
    try {
      routineIdForEvent = selectedRoutine.trackId;
    } catch (e) {
      routineIdForEvent = "INBOX";
    }
    let routineNameForEvent;
    try {
      routineNameForEvent = selectedRoutine.name;
    } catch (e) {
      routineNameForEvent = "Inbox";
    }

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("events")
      .doc(eventId)
      .set({
        archived: false,
        routineId: routineIdForEvent,
        title: eventName,
        start: moment(eventStartTime).format("YYYY-MM-DDTHH:mm:ss"),
        end: moment(eventEndTime).format("YYYY-MM-DDTHH:mm:ss"),
        userId: userId,
        maintenanceRequired: false,
        gridRow: gridRowForCalendar,
        span: gridSpanForCalendar,
        textColor: "text-blue-500",
        bgColor: "bg-blue-50",
        key: generateKey(),
        routineName: routineNameForEvent,
        taskId: taskId,
      })
      .then((docRef) => {
        db.collection("tasks")
          .where("trackId", "==", routineIdForEvent)
          .get()
          .then(function (querySnapshot) {
            return querySnapshot.size;
          })
          .then((tasksLength) => {
            let taskStartTime;
            let taskEndTime;
            let taskDate;
            if (routineIdForEvent === "INBOX") {
              taskStartTime = "";
              taskEndTime = "";
              taskDate = "";
            } else {
              taskStartTime = moment(eventStartTime).format(
                "YYYY-MM-DDTHH:mm:ss"
              );
              taskEndTime = moment(eventEndTime).format("YYYY-MM-DDTHH:mm:ss");
              taskDate = selectedDate;
            }
            db.collection("tasks").doc(taskId).set({
              archived: false,
              trackId: routineIdForEvent,
              title: eventName,
              task: eventName,
              date: taskDate,
              start: taskStartTime,
              end: taskEndTime,
              index: tasksLength,
              userId: auth.currentUser.uid,
              eventId: eventId,
            });
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
      <div className="flex h-full w-full flex-col">
        <div className="flex flex-auto overflow-hidden bg-white">
          <ModalAdd
            isOpenEventModal={isOpenEventModal}
            eventName={eventName}
            setEventName={setEventName}
            handleKeypress={handleKeypress}
            showSmallCalendar={showSmallCalendar}
            setShowSmallCalendar={setShowSmallCalendar}
            showInitialTimePicker={showInitialTimePicker}
            setShowInitialTimePicker={setShowInitialTimePicker}
            showFinalTimePicker={showFinalTimePicker}
            setShowFinalTimePicker={setShowFinalTimePicker}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            initialTimeValue={initialTimeValue}
            setInitialTimeValue={setInitialTimeValue}
            finalTimeValue={finalTimeValue}
            setFinalTimeValue={setFinalTimeValue}
            selectedRoutine={selectedRoutine}
            setSelectedRoutine={setSelectedRoutine}
            modalSettingOpen={modalSettingOpen}
            setModalSettingOpen={setModalSettingOpen}
            modalInitialTimeValue={modalInitialTimeValue}
            setModalInitialTimeValue={setModalInitialTimeValue}
            modalEndTimeValue={modalEndTimeValue}
            setModalEndTimeValue={setModalEndTimeValue}
            modalSettingButtonRef={modalSettingButtonRef}
            initialTimePickerButtonRef={initialTimePickerButtonRef}
            finalTimePickerButtonRef={finalTimePickerButtonRef}
            routinePickerButtonRef={routinePickerButtonRef}
            showRoutinesList={showRoutinesList}
            setShowRoutinesList={setShowRoutinesList}
            routineSetterOpen={routineSetterOpen}
            setRoutineSetterOpen={setRoutineSetterOpen}
            closeModal={closeModal}
            setEventStartTime={setEventStartTime}
            setEventEndTime={setEventEndTime}
            addEvent={addEvent}
            currentRoutinePage={false}
          />
          <div className="flex flex-auto flex-col overflow-auto">
            <div className="flex w-full flex-auto">
              <div
                className="w-12 flex-none bg-white sm:w-14"
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
                            setModalInitialTimeValue(
                              moment()
                                .hour((i * 12 + 2 - 2) / 12)
                                .minute(0)
                                .format("h:mm A")
                            );
                            setModalEndTimeValue(
                              moment()
                                .hour((i * 12 + 2 - 2) / 12 + 1)
                                .minute(0)
                                .format("h:mm A")
                            );
                            setEventStartTime(
                              moment()
                                .hour((i * 12 + 2 - 2) / 12)
                                .minute(0)
                            );
                            setEventEndTime(
                              moment()
                                .hour((i * 12 + 2 - 2) / 12 + 1)
                                .minute(0)
                            );

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
                      className="relative mt-px flex z-40 w-52 sm:w-auto"
                      style={{
                        gridRow: `${block.gridRow} / span ${block.span}`,
                        gridColumn: "1 / span 1",
                      }}
                      key={block.key}
                    >
                      <a
                        href={`/app/tasks/${block.routineId}`}
                        className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 pl-2 pt-1 text-xs leading-4 hover:bg-blue-100"
                      >
                        <div className="flex flex-row content-end">
                          <p className=" font-semibold text-blue-700 w-fit">{`${block.title}`}</p>
                          <p className="ml-3 mr-2 text-gray-400">|</p>
                          <p className="ml-2 font-normal text-gray-600">
                            {` ${block.routineName}`}
                          </p>
                        </div>

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
