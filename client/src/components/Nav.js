import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { userRole } from "../enums/UserRole";
import { useNotificationContext } from "../hooks/useNotificationContext";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const { unreadCount, setUnreadCount } = useNotificationContext();

  const navigate = useNavigate();

  const navigation = [
    { name: "Home", href: "/Home", current: false },
    { name: "Reviews", href: `Reviews`, current: false },

    { name: "Appointments", href: "/Appointments", current: false },
    ...(user && user.role !== userRole.Patient
      ? [{ name: "Patients", href: "Patients", current: false }]
      : []),
    ...(user && user.role === userRole.Patient
      ? [{ name: "My Chart", href: `/patients/${user?._id}`, current: false }]
      : []),
    ...(user && user.role === userRole.Admin
      ? [{ name: "Doctors", href: `Doctors`, current: false }]
      : []),
  ];

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const response = await fetch(
          `/api/notification/getAllNotifications/${user.email}`
        );
        const json = await response.json();

        if (response.ok) {
          const unreadCount = json.filter(
            (notification) => notification.viewed === false
          ).length;

          setUnreadCount(unreadCount);
        }
      };
      fetchNotifications();
    }
  }, [user, user?.email, setUnreadCount]);

  const handleClick = () => {
    logout();
    navigate("/Home");
  };
  return (
    <Disclosure
      as='nav'
      className='bg-gray-800 h-14 bg-gradient-to-r from-violet-800 to-white-700'
    >
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center '>
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex flex-shrink-0 items-center'>
                  <img
                    className='block h-8 w-auto lg:hidden'
                    src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                    alt='Your Company'
                  />
                  <img
                    className='hidden h-8 w-auto lg:block'
                    src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                    alt='Your Company'
                  />
                </div>

                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-4'>
                    {navigation
                      .filter((item) => {
                        return (
                          (item.name !== "Calendar" &&
                            item.name !== "Appointments" &&
                            item.name !== "Patients") ||
                          user
                        );
                      })
                      .map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 '>
                {user && (
                  <div className='flex items-center space-x-2'>
                    <button
                      type='button'
                      className='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    >
                      <span className='sr-only'>View messages</span>
                      <Link
                        to='/Messenger'
                        className='flex items-center custom-link'
                      >
                        <i className='bi bi-chat-text text-xl '></i>
                      </Link>
                    </button>
                    <button
                      type='button'
                      className='rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    >
                      <span className='sr-only'>View notifications</span>
                      <Link
                        to='/Notifications'
                        className='custom-link flex items-center'
                      >
                        <BellIcon className='h-6 w-6' aria-hidden='true' />
                        {unreadCount > 0 && (
                          <span className='ml-1 text-xs bg-red-500 text-white rounded-full px-2 py-1'>
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </button>

                    <Menu as='div' className='relative ml-3'>
                      <div>
                        <Menu.Button
                          className={classNames(
                            "flex rounded-full bg-transparent text-gray-300 text-sm hover:bg-gray-700",
                            "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          )}
                        >
                          <span className='sr-only'>Open user menu</span>
                          <span className='text-block px-4 py-2 text-sm hidden sm:inline'>
                            {user.email}
                          </span>
                          <i className='bi bi-person text-xl sm:hidden'></i>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleClick}
                                className={classNames(
                                  "w-full text-left",
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}
                {!user && (
                  <button
                    type='button'
                    className={classNames(
                      "flex rounded-full bg-transparent text-gray-300 text-sm hover:bg-gray-700",
                      "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    )}
                  >
                    <span className='sr-only'>Register</span>
                    <Link to='/Login' className='custom-link'>
                      <h2 className='text-block px-4 py-2 text-sm'>Login</h2>
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pt-2 pb-3'>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
