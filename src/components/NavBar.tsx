import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const NavBar: React.FC = () => {
    return (
        <nav style={navStyle}>
            <div style={navContentStyle}>
                <div style={spacerStyle}></div> {/* Spacer for centering */}
                <Link to="/dashboard" style={linkStyle}>Home</Link>
                <div style={logoutContainerStyle}>
                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
};


const navStyle: React.CSSProperties = {
    backgroundColor: 'rgba(227, 192, 153, 0.9)', // Semi-transparent pastel
    color: '#fff9f3', // Soft white text
    padding: '10px 20px', // Thinner padding for a slim look
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 0 10px 10px', // Slightly rounded bottom corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    fontFamily: "'Comic Sans MS', cursive, sans-serif", // Playful font
    backdropFilter: 'blur(5px)', // Adds a blurry background effect
};

const navContentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    color: '#fff9f3',
};

const spacerStyle: React.CSSProperties = {
    flex: 1, // Pushes the Dashboard link to the center
};

const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#fff9f3', // Soft white text color
    fontWeight: 'bold',
    fontSize: '1.5rem', // Increase font size here
    textAlign: 'center',
    padding: '6px 12px', // Keeps padding proportional to text size
    borderRadius: '8px',
    transition: 'background-color 0.3s, transform 0.2s',
};

const logoutContainerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    color: '#fff9f3',
};

export default NavBar;



