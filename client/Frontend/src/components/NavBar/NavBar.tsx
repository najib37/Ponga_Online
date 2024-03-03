import { NavLink, Outlet } from 'react-router-dom';
import './NavBar.style.css';
import UserMenu from './NavBarUserMenu/UserMenu';
import { useUser } from '../../contexts/UserContext';

const NavBar = () => {
  const { user } = useUser();
  return (
    <>
      <nav className="nav">
        <div className={`navContainer   ${'active'}`}>
          <NavLink to="/home" className="Links">
            HOME
          </NavLink>

          <NavLink to={`/profile/${user?.username}`} className="Links">
            PROFILE
          </NavLink>

          <NavLink to="/game" className="Links">
            GAME
          </NavLink>

          <NavLink to="/chat" className="Links">
            CHAT
          </NavLink>

          <NavLink to="/about" className="Links">
            ABOUT
          </NavLink>
        </div>
        <UserMenu />
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
