import React, {useState, useRef, useEffect} from "react";
import moment from "moment";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref,
  showSmallCalendar,
  setShowSmallCalendar,
  setModalSettingOpen,
  modalSettingOpen,
  modalSettingButtonRef
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        modalSettingOpen &&
        !modalSettingButtonRef.current.contains(event.target)
      ) {
        setShowSmallCalendar(false);
        const modalElement = document.getElementById("modal");
        const saveButtonElement = document.getElementById("save-button");
        let saveButtonMarginTop = saveButtonElement.style.marginTop;

        let modalHeight = modalElement.clientHeight;
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
    props.showSmallCalendar,
    props.setShowSmallCalendar,
    props.setModalSettingOpen,
    props.modalSettingOpen,
    props.modalSettingButtonRef
  );

  return <div ref={wrapperRef}>{props.children}</div>;
}

export function SmallCalendar({
  modalSettingButtonRef,
  modalSettingOpen,
  setModalSettingOpen,
  showSmallCalendar,
  setShowSmallCalendar,
  setSelectedDate,
  toggle,
}) {
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());

  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");

  useEffect(() => {
    const day = startDay.clone().subtract(1, "day");
    const temp = [];
    while (day.isBefore(endDay, "day")) {
      temp.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
    setCalendar(temp);
  }, [value]);

  function generateKey() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  //   // Get the first day of the month in number (0-6)
  //   const firstDayOfMonth = moment().startOf("month").format("d");
  //   // add 1 day to the first day of the month to get the correct day of the week
  //   const firstDayOfMonthNumber = parseInt(firstDayOfMonth) + 1;

  return (
    <div
      className={
        !showSmallCalendar
          ? "hidden"
          : "left-5 absolute border-2 z-50 rounded-sm shadow-lg top-24 bg-white select-none"
      }
    >
      <OutsideAlerter
        modalSettingButtonRef={modalSettingButtonRef}
        setModalSettingOpen={setModalSettingOpen}
        showSmallCalendar={true}
        setShowSmallCalendar={setShowSmallCalendar}
        modalSettingOpen={modalSettingOpen}
      >
        <div
          className="flex flex-col"
          style={{
            background: "rgba(0,0,0,0.05)",
            gridGap: "2px",
          }}
        >
          <div
            id="month-indicator"
            className="flex bg-white justify-between"
            style={{
              alignItems: "center",
            }}
          >
            <div
              id="chevron-left"
              onClick={() => {
                setValue(moment(value).subtract(1, "month"));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 hover:bg-gray-100 cursor-pointer rounded-sm text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="cursor-default">{value.format("MMMM YYYY")}</p>
            <div
              id="chevron-right"
              onClick={() => {
                setValue(moment(value).add(1, "month"));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 hover:bg-gray-100 cursor-pointer rounded-md text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div
            id="day-of-week"
            className="text-xs grid bg-white cursor-default"
            style={{
              // content border box
              gridTemplateColumns: `repeat(7, 1fr)`,
              justifyItems: "center",
            }}
          >
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>
          <div
            id="date-grid"
            className=" grid"
            style={{
              gridTemplateColumns: `repeat(7, 1fr)`,
              // center items in the grid
              justifyItems: "center",
              // add lines to the grid
              gridGap: "1px",
              // add a color to the gaps
              background: "rgba(0,0,0,0.05)",
              // this is to make the calendar look cleaner
            }}
          >
            {calendar.map((week, i) => {
              return week.map((day, j) => {
                let bgColor =
                  day.month() !== value.month()
                    ? "transparent"
                    : day.date() === moment().date() &&
                      day.month() === moment().month()
                    ? "blue-500"
                    : "white";
                let color =
                  day.date() === moment().date() &&
                  day.month() === moment().month()
                    ? "white"
                    : "black";
                return (
                  <div key={generateKey()}>
                    <button
                      className={`w-6  cursor-pointer text-center bg-${bgColor} text-${color} hover:bg-opacity-75`}
                      onClick={() => {
                        setSelectedDate(day);
                        setShowSmallCalendar(false);
                        toggle();
                      }}
                    >
                      {moment(day).format("D")}
                    </button>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </OutsideAlerter>
    </div>
  );
}
