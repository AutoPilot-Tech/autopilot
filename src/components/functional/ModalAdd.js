import React, {Fragment, useEffect, useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import {RoutinePicker} from "./RoutinePicker";
import {InitialTimePicker} from "./InitialTimePicker";
import {FinalTimePicker} from "./FinalTimePicker";
import {SmallCalendar} from "./SmallCalendar";
import {Transition, Dialog} from "@headlessui/react";

import moment from "moment";

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
}) {
  //   const [fireRoutineChecker, setFireRoutineChecker] = useState(false);

  //   useEffect(() => {
  //     if (fireRoutineChecker) {
  //       if (!selectedRoutine && currentRoutinePage) {
  //         console.log("Setting routine.. automitcally..");
  //         console.log("currentRoutinePageId: ", currentRoutinePageId);
  //         console.log("name: ", currentRoutinePageName);
  //         setSelectedRoutine({
  //           trackId: currentRoutinePageId,
  //           name: currentRoutinePageName,
  //         });
  //       }
  //       setFireRoutineChecker(false);
  //     }
  //   }, [fireRoutineChecker]);
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
