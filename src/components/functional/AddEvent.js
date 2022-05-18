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
            ? "hidden sm:inline-flex z-50 p-3 absolute items-center border border-transparent rounded-full shadow-lg text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:p-3 sm:left-20 sm:top-1"
            : "hidden sm:inline-flex z-50 p-3 absolute items-center border border-transparent rounded-full shadow-lg  text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:p-3 sm:left-20 sm:top-1"
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
