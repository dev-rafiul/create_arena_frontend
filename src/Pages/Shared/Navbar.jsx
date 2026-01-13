import React from 'react';
import { Link } from 'react-router';
import Logo from '../../Components/Logo';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';
import ThemeToggle from '../../components/ThemeToggle';
import { FiUser, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();

  const handleLogout = () => {
    logOut()
      .then()
      .catch(error => {
        console.log(error);
      });
  };

  // Navigation items for logged out users (minimum 3 as per Requirements 2.2)
  const loggedOutMenu = (
    <>
      <Link to="/">
        <li className="nav-glow">Home</li>
      </Link>
      <Link to="/all_contests">
        <li className="nav-glow">All Contests</li>
      </Link>
      <Link to="/leaderboard">
        <li className="nav-glow">Leaderboard</li>
      </Link>
    </>
  );

  // Navigation items for logged in users (minimum 5 as per Requirements 2.3)
  const loggedInMenu = (
    <>
      <Link to="/">
        <li className="nav-glow">Home</li>
      </Link>
      <Link to="/all_contests">
        <li className="nav-glow">All Contests</li>
      </Link>
      <Link to="/leaderboard">
        <li className="nav-glow">Leaderboard</li>
      </Link>
      <Link to="/dashboard">
        <li className="nav-glow">Dashboard</li>
      </Link>
      <Link to="/profile">
        <li className="nav-glow">Profile</li>
      </Link>
      {role === "user" && (
        <Link to="/creator_access">
          <li className="nav-glow">Creator Access</li>
        </Link>
      )}
    </>
  );

  const currentMenu = user ? loggedInMenu : loggedOutMenu;

  return (
    <div className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-sm border-b border-base-300">
      <div className="navbar container-responsive">
        {/* Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <FiMenu className="h-5 w-5" />
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg gap-3 font-semibold border border-base-300"
            >
              {currentMenu}
            </ul>
          </div>
          <div className="md:ml-4">
            <Logo />
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-semibold text-base-content">
            {currentMenu}
          </ul>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-end gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Authentication Section */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-200"
              >
                <div className="w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                  <img
                    src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                    alt="User Profile"
                    className="rounded-full"
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-lg bg-base-100 rounded-box w-52 gap-2 border border-base-300 animate-scaleIn"
              >
                <li className="font-bold text-center text-base-content border-b border-base-300 pb-2 mb-2">
                  <div className="flex items-center gap-2 justify-center">
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">{user?.displayName || "User"}</span>
                  </div>
                </li>

                <li>
                  <Link className="font-semibold hover:bg-primary/10" to="/dashboard">
                    <FiSettings className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link className="font-semibold hover:bg-primary/10" to="/profile">
                    <FiUser className="w-4 h-4" />
                    Profile
                  </Link>
                </li>

                <div className="divider my-1"></div>

                <li>
                  <button 
                    onClick={handleLogout} 
                    className="text-error hover:bg-error/10 font-semibold"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/register"
                className="btn btn-ghost hover:btn-primary hover:scale-105 transition-all duration-200"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="btn btn-primary hover:scale-105 transition-all duration-200"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;