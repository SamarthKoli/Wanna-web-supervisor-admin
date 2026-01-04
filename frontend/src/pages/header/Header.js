import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Header.css';
import logo from '../../assets/logo.png'; 
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  // We use state to track login status so the UI re-renders on change
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check localStorage every time the page or route changes
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    setIsLoggedIn(!!token); // !! converts the token to a true/false boolean
    setRole(userRole);
  }, [location]); // Trigger this whenever the URL changes

  const getDashboardPath = () => {
    if (role === 'supervisor') return "/supervisor/dashboard";
    if (role === 'admin') return "/admin/approval";
    return "/dashboard";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          <img
            src={logo}
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Wana
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            
            {/* Dashboard only visible when logged in */}
            {isLoggedIn && (
              <Nav.Link as={Link} to={getDashboardPath()}>Dashboard</Nav.Link>
            )}
            
            <Nav.Link as={Link} to="/currentstatus">Current Status</Nav.Link>
            <Nav.Link as={Link} to="/history">History</Nav.Link>
          </Nav>

          <Nav className="right-nav">
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Sign Up</Nav.Link>
              </>
            ) : (
              // This will now show only if 'token' exists in localStorage
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;