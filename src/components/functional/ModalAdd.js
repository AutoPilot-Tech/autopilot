import React, {Fragment, useEffect, useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import {RoutinePicker} from "./RoutinePicker";
import {InitialTimePicker} from "./InitialTimePicker";
import {FinalTimePicker} from "./FinalTimePicker";
import {SmallCalendar} from "./SmallCalendar";
import {Transition, Dialog} from "@headlessui/react";
import {Editor, EditorState, CompositeDecorator, ContentState} from "draft-js";
import "draft-js/dist/Draft.css";

import moment from "moment";
import {handleTimeValueStringProcessing} from "../../helpers";
import {ConstructionOutlined} from "@mui/icons-material";

const Decorated = ({children}) => {
  return (
    <span
      style={{
        background: "#86efac",
        color: "#14532d",
        padding: "0.2rem",
        borderRadius: "0.2rem",
      }}
    >
      {children}
    </span>
  );
};

const timeSpan = ({children}) => {
  return (
    <span
      style={{
        background: "#86efac",
        color: "#14532d",
        padding: "0.2rem",
        borderRadius: "0.2rem",
      }}
    >
      {children}
    </span>
  );
};

const durationSpan = ({children}) => {
  return (
    <span
      style={{
        background: "#86efac",
        color: "#14532d",
        padding: "0.2rem",
        borderRadius: "0.2rem",
      }}
    >
      {children}
    </span>
  );
};

const recurringSpan = ({children}) => {
  return (
    <span
      style={{
        background: "#86efac",
        color: "#14532d",
        padding: "0.2rem",
        borderRadius: "0.2rem",
      }}
    >
      {children}
    </span>
  );
};

const dateAndTimeSpan = ({children}) => {
  return (
    <span
      style={{
        background: "#86efac",
        color: "#14532d",
        padding: "0.2rem",
        borderRadius: "0.2rem",
      }}
    >
      {children}
    </span>
  );
};

export function ModalAdd({
  isOpenEventModal,
  eventName,
  setEventName,
  handleKeypress,
  showSmallCalendar,
  setShowSmallCalendar,
  showInitialTimePicker,
  setShowInitialTimePicker,
  showFinalTimePicker,
  setShowFinalTimePicker,
  selectedDate,
  setSelectedDate,
  initialTimeValue,
  setInitialTimeValue,
  finalTimeValue,
  setFinalTimeValue,
  selectedRoutine,
  setSelectedRoutine,
  modalSettingOpen,
  setModalSettingOpen,
  modalInitialTimeValue,
  setModalInitialTimeValue,
  modalEndTimeValue,
  setModalEndTimeValue,
  modalSettingButtonRef,
  initialTimePickerButtonRef,
  finalTimePickerButtonRef,
  routinePickerButtonRef,
  showRoutinesList,
  setShowRoutinesList,
  routineSetterOpen,
  setRoutineSetterOpen,
  closeModal,
  setEventStartTime,
  setEventEndTime,
  addEvent,
  currentRoutinePage,
  currentRoutinePageName,
  currentRoutinePageId,
  recurring,
  setRecurring,
}) {
  const createDecorator = () =>
    new CompositeDecorator([
      // {
      //   strategy: dayStrategy,
      //   component: Decorated,
      // },
      {
        strategy: timeStrategy,
        component: timeSpan,
      },
      {
        strategy: durationStrategy,
        component: durationSpan,
      },

      {
        strategy: recurringStrategy,
        component: recurringSpan,
      },
      // {
      //   strategy: dateAndTimeStrategy,
      //   component: dateAndTimeSpan,
      // },
    ]);
  // since Javascript doesn't support if|then|else regex, this is nested positive lookahead and reverse lookaheads
  const TIME_REGEX =
    /(?:(=?(at\s)(?:(=?\d\d?)|(?!\d\d?)(twelve))(?:(=?\s?pm?)|(?!\s?pm?)\s?am?)?)|(?!(at\s)(?:(=?\d\d?)|(?!\d\d?)(twelve))(?:(=?\s?pm?)|(?!\s?pm?)\s?am?)?)(?:(=?\d\d?)|(?!\d\d?)(twelve))(?:(=?\s?pm?)|(?!\s?pm?)\s?am?))/i;
  const DURATION_REGEX =
    /(for)(\s)(\d\d?\d?\s)(?:(=?hours?)|(?!hours?)minutes?)/i;
  const RECURRING_REGEX = /(?:(=?everyday)|(?!everyday)recurring)/i;
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(createDecorator())
  );
  const [internalModalInitialState, setInternalModalInitialState] =
    React.useState("");
  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }
  let individualKeywordsPath1 = ["today", "tomorrow", "weekend", "yesterday"];
  // regex for any type of date
  let DAYKeywordsPath1 = [
    "monday",
    "mon",
    "tuesday",
    "tues",
    "wednesday",
    "wed",
    "thursday",
    "thurs",
    "thu",
    "friday",
    "fri",
    "saturday",
    "sat",
    "sunday",
    "sun",
  ];
  let NEXTKeywordsPath1 = ["week", "weekend", "month", "year", "weekday"];
  let ATKeywordsPath1 = ["getTime"];
  let DATEKeywordsPath1 = [
    "jan",
    "january",
    "feb",
    "february",
    "mar",
    "march",
    "apr",
    "april",
    "may",
    "jun",
    "june",
    "jul",
    "july",
    "aug",
    "august",
    "sep",
    "september",
    "oct",
    "october",
    "nov",
    "november",
    "dec",
    "december",
  ];

  // PATH 2: Recurring
  let EVERYKeywordsPath2 = ["week", "weekend", "month", "year", "weekday"];
  let individualKeywordsPath2 = ["everyday", "recurring"];

  // PATH 3: Duration
  let individualKeywordsPath3 = ["for"];

  function findWithRegex(
    regex,
    contentBlock,
    callback,
    typeOfRegex,
    modalInitialStateSetter,
    modalEndStateSetter,
    calendarInitialStateSetter,
    calendarEndStateSetter,
    initialEventTime,
    setEventAsRecurring
  ) {
    const text = contentBlock.getText();
    let matchArr, start;
    // while there is a match and we have not seen this match before
    while (
      (matchArr = regex.exec(text)) !== null &&
      start !== matchArr.index &&
      start !== matchArr.index + matchArr[0].length - 1
    ) {
      start = matchArr.index;
      if (typeOfRegex === "TIME") {
        let hours;
        let minutes = "0";
        // make a copy of matchArr[0]
        let match = matchArr[0];
        // remove "at" from matchArr[0]
        match = match.replace("at", "");
        // if "pm or "am" is in the string remove it
        if (match.includes("pm")) {
          match = match.replace("pm", "");
          // match to number
          hours = (parseInt(match) + 12).toString();
          match = moment().hours(hours).minutes(minutes);
          let matchEndTime = moment().hours(hours).minutes(minutes);
          matchEndTime.add(1, "hours");
          modalInitialStateSetter(match.format("h:mm A"));
          setInternalModalInitialState(match.format("h:mm A"));
          modalEndStateSetter(matchEndTime.format("h:mm A"));
          calendarInitialStateSetter(match);
          calendarEndStateSetter(matchEndTime);
        } else if (match.includes("am")) {
          match = match.replace("am", "");
          // match to number
          hours = match;
          match = moment().hours(hours).minutes(minutes);
          let matchEndTime = moment().hours(hours).minutes(minutes);
          matchEndTime.add(1, "hours");
          modalInitialStateSetter(match.format("h:mm A"));
          setInternalModalInitialState(match.format("h:mm A"));
          modalEndStateSetter(matchEndTime.format("h:mm A"));
          calendarInitialStateSetter(match);
          calendarEndStateSetter(matchEndTime);
        } else {
          // if no "pm or "am" is in the string
          // remove p or a in the string

          match = match.replace("p", "");
          match = match.replace("a", "");
          hours = match;
          match = moment().hours(hours).minutes(minutes);
          let matchEndTime = moment().hours(hours).minutes(minutes);
          matchEndTime.add(1, "hours");
          modalInitialStateSetter(match.format("h:mm A"));
          setInternalModalInitialState(match.format("h:mm A"));
          modalEndStateSetter(matchEndTime.format("h:mm A"));
          calendarInitialStateSetter(match);
          calendarEndStateSetter(matchEndTime);
        }
      } else if (typeOfRegex === "DURATION") {
        // kind of a hack, this may be unnecessary after bug fixes, but im lazy to check
        let initialTimeString =
          document.getElementById("time-suggestion").innerHTML;

        let hours;
        let minutes = 0;
        // make a copy of matchArr[0]
        let match = matchArr[0];
        // remove "for" from matchArr[0]
        match = match.replace("for", "");
        if (match.includes("hours") || match.includes("hour")) {
          let matchCopy = match;
          matchCopy = matchCopy.replace("hours", "");
          hours = matchCopy;
          // remove whitespace from hours
          hours = hours.replace(/\s/g, "");
          let matchEndTime = moment(initialTimeString, "LT").add(
            hours,
            "hours"
          );

          modalEndStateSetter(matchEndTime.format("h:mm A"));
          calendarEndStateSetter(matchEndTime);
        }
      } else if (typeOfRegex === "RECURRING") {
        setRecurring(true);
      }
      callback(start, start + matchArr[0].length);
    }
  }

  const styles = {
    editor: {
      borderBottom: "1px solid gray",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      paddingLeft: "0.2rem",
      paddingRight: "0.2rem",
    },
  };

  function dayStrategy(contentBlock, callback) {
    findWithRegex(DAYKeywordsPath1, contentBlock, callback);
  }

  function timeStrategy(contentBlock, callback, contentState) {
    let typeOfRegex = "TIME";
    findWithRegex(
      TIME_REGEX,
      contentBlock,
      callback,
      typeOfRegex,
      setModalInitialTimeValue,
      setModalEndTimeValue,
      setEventStartTime,
      setEventEndTime,
      modalInitialTimeValue,
      setRecurring
    );
  }

  function durationStrategy(contentBlock, callback, contentState) {
    let typeOfRegex = "DURATION";
    findWithRegex(
      DURATION_REGEX,
      contentBlock,
      callback,
      typeOfRegex,
      setModalInitialTimeValue,
      setModalEndTimeValue,
      setEventStartTime,
      setEventEndTime,
      modalInitialTimeValue,
      setRecurring
    );
  }

  function recurringStrategy(contentBlock, callback, contentState) {
    let typeOfRegex = "RECURRING";
    findWithRegex(
      RECURRING_REGEX,
      contentBlock,
      callback,
      typeOfRegex,
      setModalInitialTimeValue,
      setModalEndTimeValue,
      setEventStartTime,
      setEventEndTime,
      modalInitialTimeValue,
      setRecurring
    );
  }

  function dateAndTimeStrategy(contentBlock, callback, contentState) {
    findWithRegex(DATE_AND_TIME_REGEX, contentBlock, callback);
  }

  // React.useEffect(() => {
  //   if (isOpenEventModal) {
  //     focusEditor();
  //   }
  // }, [isOpenEventModal]);

  return (
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
                {/* <TextField
                  className="mt-3 w-full  text-gray-900 placeholder-gray-500 focus:rounded-md focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out border-0 border-b border-gray-300"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder={'"Study everyday at 12pm for 2 hours"'}
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
                /> */}
                <div style={styles.editor}>
                  <Editor
                    ref={editor}
                    editorState={editorState}
                    onChange={(editorState) => {
                      setEditorState(editorState);
                      setEventName(
                        // remove all words from the words array
                        editorState
                          .getCurrentContent()
                          .getPlainText()
                          .replace(
                            /\b(everyday|morning|afternoon|evening|2 hours|for)\b/g,
                            ""
                          )
                      );
                    }}
                    placeholder="Study everyday at 12pm for 2 hours"
                  />
                </div>

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
                        ref={initialTimePickerButtonRef}
                        id="time-suggestion"
                        className="select-none p-0.5 cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100 text-gray-600"
                        onClick={() => {
                          setShowInitialTimePicker(!showInitialTimePicker);
                          setModalSettingOpen(!modalSettingOpen);
                        }}
                      >
                        {modalInitialTimeValue}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300">-</p>
                    </div>
                    <div>
                      <p
                        ref={finalTimePickerButtonRef}
                        id="time-sugggestion"
                        className="p-0.5 select-none cursor-pointer hover:bg-gray-100 hover:rounded-md hover:border-b-gray-100 text-gray-600"
                        onClick={() => {
                          setShowFinalTimePicker(!showFinalTimePicker);
                          setModalSettingOpen(!modalSettingOpen);
                        }}
                      >
                        {modalEndTimeValue}
                      </p>
                    </div>
                  </div>
                  <InitialTimePicker
                    showInitialTimePicker={showInitialTimePicker}
                    setShowInitialTimePicker={setShowInitialTimePicker}
                    initialTimePickerButtonRef={initialTimePickerButtonRef}
                    modalSettingOpen={modalSettingOpen}
                    setModalSettingOpen={setModalSettingOpen}
                    initialTimeValue={initialTimeValue}
                    setInitialTimeValue={setInitialTimeValue}
                    modalInitialTimeValue={modalInitialTimeValue}
                    setModalInitialTimeValue={setModalInitialTimeValue}
                    setEventStartTime={setEventStartTime}
                  />
                  <FinalTimePicker
                    showFinalTimePicker={showFinalTimePicker}
                    setShowFinalTimePicker={setShowFinalTimePicker}
                    finalTimePickerButtonRef={finalTimePickerButtonRef}
                    modalSettingOpen={modalSettingOpen}
                    setModalSettingOpen={setModalSettingOpen}
                    finalTimeValue={finalTimeValue}
                    setFinalTimeValue={setFinalTimeValue}
                    modalEndTimeValue={modalEndTimeValue}
                    setModalEndTimeValue={setModalEndTimeValue}
                    setEventEndTime={setEventEndTime}
                  />
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
                          {selectedRoutine ? selectedRoutine.name : "Inbox"}
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
                        setEventName("");
                        closeModal();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
