import {PlusSmIcon as PlusSmIconOutline} from "@heroicons/react/outline";
import { useTracksValue } from "../../context/tracks-context";

export function AddEvent({setIsOpenEventModal, isOpenEventModal}) {
  const {openSideBar, setOpenSideBar} = useTracksValue();
  return (
    <>
      <button
        type="button"
        className={
          openSideBar
            ? "z-50 fixed inline-flex items-center p-3 border border-transparent rounded-full shadow-lg left-96 bottom-[20px]  text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            : "z-50 fixed inline-flex items-center p-3 border border-transparent rounded-full shadow-lg left-20 bottom-[20px]  text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        }
        onClick={() => {
          setIsOpenEventModal(!isOpenEventModal);
        }}
      >
        <PlusSmIconOutline className="h-7 w-7" aria-hidden="true" />
      </button>
    </>
  );
}
