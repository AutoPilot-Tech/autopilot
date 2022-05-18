import React, {useRef, useEffect} from "react";
import TextField from "@mui/material/TextField";
import moment from "moment";
import {handleTimeValueStringProcessing} from "../../helpers/index";
import {handleTimeValueToObject} from "../../helpers/index";

function useOutsideAlerter(
  ref,
  showInitialTimePicker,
  setShowInitialTimePicker,
  initialTimePickerButtonRef,
  modalSettingOpen,
  setModalSettingOpen,
  initialTimeValue,
  setInitialTimeValue
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        showInitialTimePicker &&
        !initialTimePickerButtonRef.current.contains(event.target)
      ) {
        setShowInitialTimePicker(false);
        setInitialTimeValue("");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(
    wrapperRef,
    props.showInitialTimePicker,
    props.setShowInitialTimePicker,
    props.initialTimePickerButtonRef,
    props.modalSettingOpen,
    props.setModalSettingOpen,
    props.initialTimeValue,
    props.setInitialTimeValue
  );

  return <div ref={wrapperRef}>{props.children}</div>;
}

export function InitialTimePicker({
  showInitialTimePicker,
  setShowInitialTimePicker,
  initialTimePickerButtonRef,
  modalSettingOpen,
  setModalSettingOpen,
  initialTimeValue,
  setInitialTimeValue,
  modalInitialTimeValue,
  setModalInitialTimeValue,
  setEventStartTime,
}) {
  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      const initialTimeValueString =
        handleTimeValueStringProcessing(initialTimeValue);
      let initialTimeObject = handleTimeValueToObject(initialTimeValueString);
      setModalInitialTimeValue(initialTimeValueString);
      setEventStartTime(initialTimeObject);
      setInitialTimeValue("");
      setShowInitialTimePicker(false);
    }
  };
  return (
    <div
      className={
        showInitialTimePicker
          ? "cursor-default z-50 absolute inline-block max-w-md p-3 text-left align-middle transition-all transform bg-gray-700 shadow-xl rounded-2xl overflow-visible left-9 w-48 text-white top-36"
          : "hidden"
      }
    >
      <OutsideAlerter
        showInitialTimePicker={true}
        setShowInitialTimePicker={setShowInitialTimePicker}
        initialTimePickerButtonRef={initialTimePickerButtonRef}
        modalSettingOpen={modalSettingOpen}
        setModalSettingOpen={setModalSettingOpen}
        initialTimeValue={initialTimeValue}
        setInitialTimeValue={setInitialTimeValue}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            <h3>Time</h3>
            <TextField
              className="mt-3 w-full p-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out"
              type="text"
              value={initialTimeValue}
              onChange={(e) => setInitialTimeValue(e.target.value)}
              placeholder="Add time"
              onKeyDown={(e) => handleKeypress(e)}
              inputProps={{
                style: {
                  padding: "0.25rem",
                  color: "black",
                  backgroundColor: "white",
                  borderRadius: "0.25rem",
                },
              }}
            />
          </div>
          <div className="flex flex-row justify-end">
            {/* checkbox button */}
            <button
              className="flex flex-row "
              onClick={() => {
                const initialTimeValueString =
                  handleTimeValueStringProcessing(initialTimeValue);
                let initialTimeObject = handleTimeValueToObject(
                  initialTimeValueString
                );
                setModalInitialTimeValue(initialTimeValueString);
                setEventStartTime(initialTimeObject);
                setShowInitialTimePicker(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </OutsideAlerter>
    </div>
  );
}
