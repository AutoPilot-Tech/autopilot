import {Fragment} from "react";
import {PlusSmIcon as PlusSmIconSolid} from "@heroicons/react/solid";
import {PlusSmIcon as PlusSmIconOutline} from "@heroicons/react/outline";
import {Menu, Popover, Transition} from "@headlessui/react";

const navigation = [
  {name: "Add Task"},
  {name: "Add Time Box"},
  {
    name: "Add Routine",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const CircularButton = () => {
  
  return (
    <>
      {/* <button
        type="button"
        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />
      </button> */}
      <Menu as="div" className="flex-shrink-0 relative mr-5">
        <div>
          <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open user menu</span>
            <div className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />
            </div>{" "}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
            {navigation.map((item) => (
              <Menu.Item key={item.name}>
                {({active}) => (
                  <a
                    href={item.href}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block py-2 px-4 text-sm text-gray-700"
                    )}
                    onClick={item.onClick ? item.onClick : null}
                  >
                    {item.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
