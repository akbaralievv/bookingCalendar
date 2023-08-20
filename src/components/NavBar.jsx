import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="header">
      <NavLink to={'/'} className={({ isActive }) => (isActive ? 'active' : '')}>
        Главная
      </NavLink>
      <NavLink to={'/admin'} className={({ isActive }) => (isActive ? 'active' : '')}>
        Админ панель
      </NavLink>
    </header>
  );
}

export default Navbar;
