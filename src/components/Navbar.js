import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-logo-dot" />
          <span>Online Voting System</span>
        </NavLink>

        {/* Right side menu */}
        <div className="navbar-menu">
          {user ? (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  'navbar-link' + (isActive ? ' navbar-link--active' : '')
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/elections"
                className={({ isActive }) =>
                  'navbar-link' + (isActive ? ' navbar-link--active' : '')
                }
              >
                Elections
              </NavLink>
              <NavLink
                to="/candidates/register"
                className={({ isActive }) =>
                  'navbar-link' + (isActive ? ' navbar-link--active' : '')
                }
              >
                Register as Candidate
              </NavLink>

              <div className="navbar-user-wrapper">
                <div className="navbar-avatar">
                  {initials || <span className="navbar-avatar-fallback">U</span>}
                </div>
                <div className="navbar-user-text">
                  <span className="navbar-user-label">Signed in as</span>
                  <span className="navbar-user-name">{user.name}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="navbar-logout-btn"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  'navbar-link' + (isActive ? ' navbar-link--active' : '')
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  'navbar-link navbar-link--pill' +
                  (isActive ? ' navbar-link--active-pill' : '')
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
