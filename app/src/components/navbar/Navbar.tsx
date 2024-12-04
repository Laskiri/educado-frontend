import {Icon} from '@mdi/react';
import { mdiBellOutline, mdiAccount, mdiLogoutVariant, mdiCertificate, mdiNotebookOutline, mdiAccountCog, mdiChatQuestionOutline } from '@mdi/js';
import { Link } from 'react-router-dom'
import useAuthStore from '../../contexts/useAuthStore'
import { getUserInfo } from '../../helpers/userInfo';
import { useEffect, useState } from 'react';
import { useNotifications } from '../notification/NotificationContext';

export const Navbar = () => {
  const { clearToken } = useAuthStore((state) => state);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addNotification, notifications, setNotifications } = useNotifications();

  // Logout handler
  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('token');
  };

  // Fetch user info
  const userInfo: any = getUserInfo();

  let firstName;
  userInfo.firstName ? (firstName = userInfo.firstName) : (firstName = "Firstname");

  let lastName = "Lastname";
  userInfo.lastName ? (lastName = userInfo.lastName) : (lastName = "Lastname");

  let email = "email";
  userInfo.email ? (email = userInfo.email) : (email = "Email");

  // Notification handlers
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleDeleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleClearAll = () => setNotifications([]);

  return (
    <main>
      <nav className="relative navbar fixed items-center justify-between py-3.5 px-6 bg-white shadow-md">
        {/* Navbar Logo */}
        <div className="w-[165.25px] h-6 justify-start items-center gap-[7.52px] flex py-6 px-8">
          <Link to="/" className="w-[165.25px] h-6 flex items-center gap-[6px] text-xl">
            <img src="/logo.svg" alt="logo" className="w-[24.43px] h-6" />
            <img src="/educado.svg" alt="educado" className="h-6" />
          </Link>
        </div>

        {/* Navbar Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link to="/courses" className="flex items-center text-lg font-['Montserrat']">
                <Icon path={mdiNotebookOutline} size={1} color="grayMedium" />
                <span>Cursos</span>
              </Link>
            </li>
            <li>
              <Link to="/certificates" className="flex items-center text-lg font-['Montserrat']">
                <Icon path={mdiCertificate} size={1} color="grayMedium" />
                <span>Meus certificados</span>
              </Link>
            </li>
            <li>

              {userInfo.role === "admin" && (
                <Link to="/educado-admin/applications" className="flex items-center text-lg font-['Montserrat']">
                  <Icon path={mdiAccount} size={1} color="grayMedium" />
                  <span>Admin</span>
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Notification Bell and User Info */}
        <div className="relative flex items-center gap-6 pr-12 z-50">

          {/* Notification Bell */}
          <div className="relative flex items-center gap-6">
            <button onClick={toggleDropdown} className="relative flex items-center">
              <Icon path={mdiBellOutline} size={1} color="grayMedium" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs leading-tight text-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isDropdownOpen && (
              <div className="dropdown dropdown-end bg-white absolute w-[245px] top-12 right-0 rounded-lg shadow-md z-50">
                <div className="p-2 max-h-[250px] overflow-y-auto">
                  <ul className="menu flex flex-col items-start w-full">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li key={notification.id} className="relative p-2 hover:bg-gray-100 w-full flex items-start">
                          {notification.link ? (
                            <a href={notification.link} className="text-sm text-blue-600 hover:underline">
                              {notification.message}
                            </a>
                          ) : (
                            <span className="text-sm">{notification.message}</span>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="absolute top-0 right-0 text-red-500 text-sm"
                          >
                            ✕
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500 text-sm">No notifications</li>
                    )}
                  </ul>
                </div>

                {notifications.length > 0 && (
                  <div className="w-full text-right border-t mt-2 p-2">
                    <button onClick={handleClearAll} className="text-sm text-red-600 hover:underline">
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col items-start">
            <span className="hidden sm:block text-lg font-bold text-grayMedium font-['Montserrat']">
              {`${firstName} ${lastName}`}
            </span>
            <span className="hidden sm:block text-sm font-normal text-grayMedium font-['Montserrat']">
              {email}
            </span>
          </div>

          {/* User Actions Dropdown */}
          <div className="relative">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost hover:bg-transparent">
                <div className="avatar placeholder">
                  <div className="bg-[#166276] text-white rounded-full hover:rounded w-11">
                    <span className="text-md">{`${firstName.charAt(0)}${lastName.charAt(0)}`}</span>
                  </div>
                </div>
              </label>

              <ul tabIndex={0} className="menu dropdown-content flex flex-col items-start p-2 absolute w-[245px] mt-2 bg-white rounded-lg shadow-md">
                <li className="w-full">
                  <Link to="/profile" className="text-grayDark text-lg hover:bg-grayLight">
                    <Icon path={mdiAccountCog} size={1} color="grayMedium" />
                    <span>Editar perfil</span>
                  </Link>
                </li>
                <hr className="w-full border-grayLight my-3" />
                <li className="w-full">
                  <Link to="/certificates" className="text-grayDark text-lg hover:bg-grayLight">
                    <Icon path={mdiCertificate} size={1} color="grayMedium" />
                    <span>Meus certificados</span>
                  </Link>
                </li>
                <hr className="w-full border-grayLight my-3" />
                <li className="w-full">
                  <Link to="/feedback" className="text-grayDark text-lg hover:bg-grayLight">
                    <Icon path={mdiChatQuestionOutline} size={1} color="grayMedium" />
                    <span>Feedback</span>
                  </Link>
                </li>
                <hr className="w-full border-grayLight my-3" />
                <li className="w-full">
                  <Link to="/welcome" onClick={handleLogout} className="text-warning text-lg font-bold hover:bg-grayLight">
                    <Icon path={mdiLogoutVariant} size={1} color="warning" />
                    <span>Sair</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* gap between navbar and other pages */}
      <div className="h-0" />
    </main>
  );
};
