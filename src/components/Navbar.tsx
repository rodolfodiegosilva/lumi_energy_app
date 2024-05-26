import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <header className="header">
      <NavLink to="/" className="nav__logo">
        Lumi Energy
      </NavLink>
      <button className="nav__toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`nav__list ${isMenuOpen ? 'nav__list--open' : ''}`}>
        <li className="nav__item">
          <NavLink to="/upload-invoice" className="nav__link" onClick={toggleMenu}>Upload Invoice</NavLink>
        </li>
        <li className="nav__item">
          <NavLink to="/dashboard" className="nav__link" onClick={toggleMenu}>Dashboard</NavLink>
        </li>
        <li className="nav__item">
          <NavLink to="/library" className="nav__link" onClick={toggleMenu}>Invoice Library</NavLink>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
