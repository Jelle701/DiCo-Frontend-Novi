/**
 * HamburgerMenu.jsx - A responsive hamburger menu component for navigation.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './HamburgerMenu.css';

/**
 * @function HamburgerMenu
 * @summary Provides a toggleable navigation menu, including logout functionality.
 */
const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className="hamburger-menu" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className={`hamburger-button ${isOpen ? 'open' : ''}`}
                aria-label="Toggle menu"
            >
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </button>

            {isOpen && (
                <div className="dropdown-content">
                    <ul>
                        <li>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        </li>
                        <li className="separator"></li>
                        <li>
                            <button onClick={logout} className="logout-button">
                                Uitloggen
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
