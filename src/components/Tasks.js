import React, {useEffect, useState, useRef, useCallback} from "react";
import update from "immutability-helper";

import {useTasks} from "../hooks";
import {collatedTasks} from "../constants";
import {getTitle, getCollatedTitle, collatedTasksExist} from "../helpers";
import {useTracksValue} from "../context/tracks-context";
import {Calendar} from "../../src/components/Calendar";

import {RoutineSettings} from "./RoutineSettings";
import {db, auth} from "../firebase";
import {TaskHeader} from "./TaskHeader";
import {EmptyStateTasks} from "./EmptyStateTasks";
import {AutopilotSettings} from "./AutopilotSettings";
import {IndividualTask} from "./IndividualTask";
import moment from "moment";
import {ModalAdd} from "./functional/ModalAdd";
import {getGridRowFromTime} from "../helpers/index";
import {getGridSpanFromTime} from "../helpers/index";
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

// this just gets the tasks and renders them
export const Tasks = ({trackId, isOpenEventModal, setIsOpenEventModal}) => {
  const {tracks, selectedTrack, setSelectedTrack, isRoutine, openSideBar} =
    useTracksValue();
  let {tasks, setTasks} = useTasks(trackId);
  const tasksRef = useRef(tasks);
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

  const moveTaskListItem = useCallback((dragIndex, hoverIndex, tasks) => {
    // setTasks((prevTasks) =>
    //   update(prevTasks, {
    //     $splice: [
    //       [dragIndex, 1],
    //       [hoverIndex, 0, prevTasks[dragIndex]],
    //     ],
    //   })
    // );

    const dragTask = tasks[dragIndex].id;
    const hoverTask = tasks[hoverIndex].id;

    db.collection("tasks").doc(dragTask).update({
      index: hoverIndex,
    });
    db.collection("tasks").doc(hoverTask).update({
      index: dragIndex,
    });
  }, []);

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
    console.log("from within addEvent");
    console.log("selectedRoutine", selectedRoutine);
    const userId = auth.currentUser.uid;
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
      .add({
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
      });

    const tasksLength = db
      .collection("tasks")
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
          taskStartTime = moment(eventStartTime).format("YYYY-MM-DDTHH:mm:ss");
          taskEndTime = moment(eventEndTime).format("YYYY-MM-DDTHH:mm:ss");
          taskDate = selectedDate;
        }
        db.collection("tasks").add({
          archived: false,
          trackId: routineIdForEvent,
          title: eventName,
          task: eventName,
          date: taskDate,
          start: taskStartTime,
          end: taskEndTime,
          index: tasksLength,
          userId: auth.currentUser.uid,
        });
      });
  }

  const renderTask = useCallback((task, tasks) => {
    return (
      <li key={task.id}>
        <IndividualTask
          task={task}
          key={task.id}
          index={task.index}
          moveListItem={moveTaskListItem}
        />
      </li>
    );
  }, []);

  let trackName = "";

  if (collatedTasksExist(trackId) && trackId) {
    // if the selected track is a collated track (i.e. TODAY, CALENDAR, etc)
    trackName = getCollatedTitle(collatedTasks, trackId);
  }

  if (
    // if the selected track is not a collated track (i.e. a specific track)
    tracks &&
    tracks.length > 0 &&
    trackId &&
    !collatedTasksExist(trackId)
  ) {
    trackName = getTitle(tracks, trackId);
  }

  useEffect(() => {
    setSelectedTrack(trackId);
  }, []);

  useEffect(() => {
    document.title = `Autopilot: ${trackName}`;
    setSelectedRoutine({
      trackId: trackId,
      name: trackName,
    });
  }, [trackName]);

  // if setCalendar is true, then we will show the calendar

  return (
    <div
      className={
        openSideBar
          ? "transform transition ease-in-out absolute w-full h-screen bg-white translate-x-72 pr-72"
          : "transform transition ease-in-out h-screen flex flex-col bg-white"
      }
    >
      <div className="flex h-full w-full flex-col ml-4 pr-8 sm:ml-24 sm:pr-32">
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
          currentRoutinePage={true}
          currentRoutinePageName={trackName}
          currentRoutinePageId={trackId}
        />
        <TaskHeader trackName={trackName} trackId={trackId} />
        {/* <ColorSettings /> */}
        {/* {isRoutine ? <RoutineSettings /> : <></>} */}

        {/* if there are no tasks, show the emptystate component, otherwise render them */}
        {tasks.length === 0 ? (
          <EmptyStateTasks />
        ) : (
          <>
            <div className="flex flex-col shadow ring-2 p-1 bg-white ring-black ring-opacity-5 md:rounded-lg ">
              <ul>{tasks.map((task) => renderTask(task, tasks))}</ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
