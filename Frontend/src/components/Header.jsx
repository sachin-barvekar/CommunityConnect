import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="max-w-6xl mx-auto p-5">
        <div className="flex justify-between items-center">
          <NavLink to="/">
            <h1 className="font-bold text-2xl sm:text-3xl flex flex-wrap">
              <span className="text-slate-500">Community</span>
              <span className="text-slate-700">Connect</span>
            </h1>
          </NavLink>
          <div className="flex items-center">
            <nav className={`hidden sm:flex sm:items-center sm:ml-auto`}>
              <ul className="flex flex-row gap-6">
                <li>
                  <NavLink exact to="/" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/events" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                    Events
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/news" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                    News
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/projects" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                    Projects
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/volunteer-opportunities" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                    Volunteer
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                    {currentUser ? 'Profile' : 'Sign in'}
                  </NavLink>
                </li>
              </ul>
            </nav>
            <button
              aria-label="Toggle navigation menu"
              className="block text-3xl sm:hidden focus:outline-none ml-4"
              onClick={toggleMenu}
            >
              &#9776;
            </button>
          </div>
        </div>
        <nav className={`sm:hidden ${isOpen ? 'block' : 'hidden'} mt-4`}>
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink exact to="/" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/news" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                News
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer-opportunities" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                Volunteers
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" activeClassName="active-link" className="text-xl text-slate-700 hover:underline">
                {currentUser ? 'Profile' : 'Sign in'}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}