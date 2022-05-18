import {PlusSmIcon as PlusSmIconOutline} from "@heroicons/react/outline";
import {useTracksValue} from "../../context/tracks-context";

export function AddEvent({setIsOpenEventModal, isOpenEventModal}) {
  const {openSideBar, setOpenSideBar} = useTracksValue();
  return (
    <>
      <button
        type="button"
        className={
          openSideBar
            ? "hidden z-50 absolute sm:inline-flex items-center p-3 border border-transparent rounded-full shadow-lg left-16 top-3 text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform delay-75 ease-in-out translate-x-72"
            : "hidden z-50 absolute sm:inline-flex items-center p-3 border border-transparent rounded-full shadow-lg left-16 top-3  text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform delay-75 ease-in-out "
        }
        onClick={() => {
          setIsOpenEventModal(!isOpenEventModal);
        }}
      >
        <PlusSmIconOutline className="h-7 w-7" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={
          openSideBar
            ? "sm:hidden hidden z-50 p-3 sm:fixed sm:left-20  bottom-3 sm:bottom-0 right-3 items-center border border-transparent rounded-full shadow-lg text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:p-3 sm:top-1"
            : "sm:hidden z-50 p-3 fixed bottom-3 right-3 items-center border border-transparent rounded-full shadow-lg  text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:p-3 sm:left-20 sm:top-1"
        }
        onClick={() => {
          setIsOpenEventModal(!isOpenEventModal);
        }}
      >
        <PlusSmIconOutline
          className="h-10 w-10 sm:h-7 sm:w-7"
          aria-hidden="true"
        />
      </button>
    </>
  );
}
