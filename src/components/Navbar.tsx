import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <header className='header'>
      <NavLink to='/' className='nav__logo'>
        Lumi Energy
      </NavLink>
      <ul className='nav__list'>
        <li className='nav__item'>
          <NavLink to='/upload-invoice' className='nav__link'>Upload Invoice</NavLink>
        </li>
        <li className='nav__item'>
          <NavLink to='/dashboard' className='nav__link'>Dashboard</NavLink>
        </li>
        <li className='nav__item'>
          <NavLink to='/library' className='nav__link'>Invoice Library</NavLink>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
