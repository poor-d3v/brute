import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '../styles/theme';
import { FaLock } from 'react-icons/fa';

const Nav = styled.nav`
  background-color: ${theme.colors.primary.charcoalBlack};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${theme.colors.primary.white};
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: ${theme.typography.fontWeight.bold};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.primary.green};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? theme.colors.primary.green : theme.colors.primary.white};
  text-decoration: none;
  font-family: ${theme.typography.fontFamily.primary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: ${theme.colors.primary.green};
    background-color: ${theme.colors.primary.deepSpaceGray};
  }
`;

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <Nav>
      <Brand to="/">
        <FaLock size={24} />
        BRUTE
      </Brand>
      <NavLinks>
        <NavLink to="/" $active={location.pathname === '/'}>
          Home
        </NavLink>
        <NavLink to="/about" $active={location.pathname === '/about'}>
          About
        </NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar; 