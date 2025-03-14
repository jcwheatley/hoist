import { Link } from "react-router-dom";
import { auth, logOut } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [user] = useAuthState(auth);

  return (
    <nav className='bg-white shadow-md p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50'>
      <h1 className='text-2xl font-bold text-gray-900'>HOIST</h1>

      {/* Navigation Links */}
      <div className='flex space-x-6'>
        <Link to='/dashboard' className='text-gray-700 hover:text-black'>
          Dashboard
        </Link>
        <Link to='/workouts' className='text-gray-700 hover:text-black'>
          Workouts
        </Link>
      </div>

      {/* Profile Dropdown */}
      <div className='relative'>
        <Menu as='div' className='relative'>
          <Menu.Button className='flex items-center space-x-2'>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt='Profile'
                className='w-10 h-10 rounded-full border'
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                className='w-10 h-10 text-gray-700'
              />
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50'>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to='/profile'
                    className={`block px-4 py-2 text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to='/settings'
                    className={`block px-4 py-2 text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Settings
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logOut}
                    className={`block w-full text-left px-4 py-2 text-red-600 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
}
