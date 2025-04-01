import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDumbbell,
  faBook,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const location = useLocation();

  return (
    <footer className='bg-[#0A0E15] text-white fixed bottom-0 w-full p-3 shadow-md pb-6'>
      <div className='flex justify-around'>
        <NavItem
          to='/dashboard'
          icon={faHome}
          label='Home'
          active={location.pathname === "/dashboard"}
        />
        <NavItem
          to='/workout'
          icon={faDumbbell}
          label='Workout'
          active={location.pathname === "/workout"}
        />
        <NavItem
          to='/library'
          icon={faBook}
          label='Library'
          active={location.pathname === "/library"}
        />
        <NavItem
          to='/profile'
          icon={faUser}
          label='Profile'
          active={location.pathname === "/profile"}
        />
      </div>
    </footer>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center text-sm ${
        active ? "text-white" : "text-gray-400"
      }`}
    >
      <FontAwesomeIcon icon={icon} className='text-xl' />
      <span className='mt-1'>{label}</span>
    </Link>
  );
}
