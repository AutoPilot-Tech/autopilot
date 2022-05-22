import {Fragment, useEffect, useState} from "react";
import {Menu, Popover, Transition} from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import {BellIcon, MenuIcon, XIcon} from "@heroicons/react/outline";
import {auth, db} from "../../firebase";
import {CircularButton} from "../CircularButton";
import {useLoadingValue} from "../../context/loading-context";
import {useTracksValue} from "../../context/tracks-context";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const logOut = () => {
  auth
    .signOut()
    .then(() => {
      // send user back to log in page
      window.location.href = "/login";
    })
    .catch((error) => {
      console.log(error.message);
    });
};

const navigation = [
  {name: "Dashboard", href: "#", current: true},
  {name: "Calendar", href: "#", current: false},
  {name: "Teams", href: "#", current: false},
  {name: "Directory", href: "#", current: false},
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Header() {
  let navigate = useNavigate();

  // const {photoUrl} = useLoadingValue();
  const {nowValue, setNowValue} = useTracksValue();
  const {openSideBar, setOpenSideBar, darkMode, setDarkMode} =
    useLoadingValue();
  const [bg, setBg] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [border, setBorder] = useState("border-gray-200");
  const userNavigation = [
    // {name: "Your Profile", href: "#", onClick: ""},
    // {name: "Settings", href: "/settings", onClick: ""},
    {name: "Sign out", href: "#", onClick: logOut},
    {
      name: "Toggle Darkmode",
      href: "#",
      onClick: () => {
        setDarkMode(!darkMode);
      },
    },
  ];
  useEffect(() => {
    setBg(darkMode ? "bg-neutral-800" : "");
    setMainColor(darkMode ? "text-neutral-200" : "");
    setSecondaryColor(darkMode ? "text-neutral-400" : "text-gray-500");
    setBorder(darkMode ? "border-neutral-900" : "border-gray-200");
  }, [darkMode]);
  return (
    <header
      className={`relative ${bg} z-20 flex flex-none items-center justify-between border-b ${border} py-1 px-6`}
    >
      <div className="flex items-center gap-x-3">
        <MenuIcon
          className={
            darkMode
              ? "h-6 w-8 rounded-md hover:bg-neutral-700 text-neutral-600 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:cursor-pointer"
              : "h-6 w-8 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:cursor-pointer"
          }
          aria-hidden="true"
          onClick={() => {
            setOpenSideBar(!openSideBar);
          }}
        />
        <div
          className="hidden lg:block lg:cursor-pointer"
          onClick={() => {
            navigate("/app/calendar/home");
          }}
        >
          <img
            className="select-none block w-auto h-14 sm:w-32 sm:h-10 lg:w-auto lg:h-14"
            src="../../../../images/autopilot_alpha.png"
            alt="Autopilot"
          />
        </div>
      </div>
      <div className="flex">
        <h1 className="text-lg font-semibold text-gray-900 mr-2">
          <time className={`${mainColor} select-none sm:hidden`}>
            {moment(nowValue).format("MMM Do")}
          </time>
          <time className={`${mainColor} select-none hidden sm:inline`}>
            {moment(nowValue).format("MMMM Do, YYYY")}
          </time>
        </h1>
        <p
          className={`select-none mt-1 text-sm ${secondaryColor} hidden md:inline`}
        >
          {moment(nowValue).format("dddd")}
        </p>
        <p
          className={`select-none mt-1 text-sm font-light ${secondaryColor} md:hidden`}
        >
          {moment(nowValue).format("ddd")}
        </p>
      </div>
      <div className="flex items-center">
        <div className="flex items-center rounded-md shadow-sm md:items-stretch">
          <button
            type="button"
            className={
              darkMode
                ? "flex items-center justify-center rounded-l-md border border-r-0 border-neutral-800 bg-neutral-700 py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-600"
                : "flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            }
            onClick={() => {
              // subtract 1 day from the nowValue
              setNowValue(moment(nowValue).subtract(1, "day").toDate());
            }}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={
              darkMode
                ? "hidden border-t border-b border-neutral-800 bg-neutral-700 px-3.5 text-sm font-medium text-gray-400 hover:bg-neutral-600 hover:text-gray-500 focus:relative md:block"
                : "hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
            }
            onClick={() => {
              setNowValue(moment().toDate());
            }}
          >
            Today
          </button>
          <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            className={
              darkMode
                ? "flex items-center justify-center rounded-r-md border border-l-0 border-neutral-800 bg-neutral-700 py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-neutral-600"
                : "flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
            }
            onClick={() => {
              // add 1 day from the nowValue
              setNowValue(moment(nowValue).add(1, "day").toDate());
            }}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {/* Profile dropdown */}
        <Menu as="div" className="ml-3 relative">
          <div>
            <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src={auth.currentUser.photoURL}
                alt=""
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({active}) => (
                    <a
                      href={item.href}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                      onClick={() => {
                        item.onClick();
                      }}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        {/* <div className="hidden md:ml-4 md:flex md:items-center">
          <Menu as="div" className="relative">
            <Menu.Button
              type="button"
              className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Day view
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="app/calendar/home"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="app/calendar/week"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <a
                        href="app/calendar/month"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div> */}
        {/* <Menu as="div" className="relative ml-6 md:hidden">
          <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="focus:outline-none absolute right-0 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Menu.Item>
                  {({active}) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Create event
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({active}) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Go to today
                    </a>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({active}) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Day view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({active}) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Week view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({active}) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Month view
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({active}) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Year view
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu> */}
      </div>
    </header>
  );
}
