/**
 * Navbar.jsx - Responsive navigation bar for the application.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import DicoLogo from '../../content/DiCo_logo.svg';
import './NavBar.css';

/**
 * @function Navbar
 * @summary Renders the main navigation bar with dynamic links based on user authentication and role.
 */
const Navbar = () => {
    const { isAuth, logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isAdmin = user?.role === 'ADMIN';
    const isProvider = user?.role === 'PROVIDER';
    const isGuardian = user?.role === 'GUARDIAN';
    const dashboardPath = isAdmin ? '/admin-dashboard' : isProvider ? '/provider-dashboard' : isGuardian ? '/guardian-portal' : '/dashboard';

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const closeMenu = () => setMenuOpen(false);

    const getAdminNavLinkClass = (targetHash) => {
        const isBasePathActive = location.pathname === '/admin-dashboard';
        let isThisLinkActive = false;
        if (targetHash === '#dashboard') {
            isThisLinkActive = isBasePathActive && (location.hash === '' || location.hash === '#dashboard');
        } else if (targetHash === '#management') {
            isThisLinkActive = isBasePathActive && location.hash === '#management';
        }
        return `nav-link ${isThisLinkActive ? 'active' : ''}`;
    };

    const getNavLinkClass = ({ isActive }) => {
        return `nav-link ${isActive ? 'active' : ''}`;
    };

    return (
        <nav className="navbar" ref={menuRef}>
            <div className="navbar-container d-flex justify-between items-center">
                <NavLink to={isAuth ? dashboardPath : "/"} className="navbar-logo" onClick={closeMenu}>
                    <img src={DicoLogo} alt="App Logo" />
                </NavLink>

                <button
                    onClick={toggleMenu}
                    className={`hamburger-button ${menuOpen ? 'open' : ''}`}
                    aria-label="Toggle menu"
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>

                <ul className="nav-menu-desktop">
                    {isAuth ? (
                        <>
                            {isAdmin ? (
                                <>
                                    <li><Link to="/admin-dashboard#dashboard" className={getAdminNavLinkClass('#dashboard')}>Dashboard</Link></li>
                                    <li><Link to="/admin-dashboard#management" className={getAdminNavLinkClass('#management')}>Gebruikersbeheer</Link></li>
                                </> 
                            ) : isGuardian ? (
                                <li><NavLink to="/guardian-portal" className={getNavLinkClass}>Ouderportaal</NavLink></li>
                            ) : isProvider ? (
                                <>
                                    <li><NavLink to="/provider-dashboard" className={getNavLinkClass}>Dashboard</NavLink></li>
                                    <li><NavLink to="/patient-portal" className={getNavLinkClass}>Patiënten Beheren</NavLink></li>
                                </>
                            ) : (
                                <>
                                    <li><NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink></li>
                                    <li><NavLink to="/my-data" className={getNavLinkClass}>Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className={getNavLinkClass}>Services</NavLink></li>
                                </>
                            )}
                            
                            <li><button onClick={handleLogout} className="btn btn--outline">Uitloggen</button></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/login" className="nav-link">Inloggen</NavLink></li>
                            <li><NavLink to="/register" className="btn btn--primary">Registreren</NavLink></li>
                        </>
                    )}
                </ul>

                <div className={`nav-menu-mobile ${menuOpen ? 'open' : ''}`}>
                    <ul>
                        {isAuth ? (
                            <>
                                {isAdmin ? (
                                    <>
                                        <li><Link to="/admin-dashboard#dashboard" className={getAdminNavLinkClass('#dashboard')} onClick={closeMenu}>Dashboard</Link></li>
                                        <li><Link to="/admin-dashboard#management" className={getAdminNavLinkClass('#management')} onClick={closeMenu}>Gebruikersbeheer</Link></li>
                                    </> 
                                ) : isGuardian ? (
                                    <li><NavLink to="/guardian-portal" className={getNavLinkClass} onClick={closeMenu}>Ouderportaal</NavLink></li>
                                ) : isProvider ? (
                                    <>
                                        <li><NavLink to="/provider-dashboard" className={getNavLinkClass} onClick={closeMenu}>Dashboard</NavLink></li>
                                        <li><NavLink to="/patient-portal" className={getNavLinkClass} onClick={closeMenu}>Patiënten Beheren</NavLink></li>
                                    </>
                                ) : (
                                    <>
                                        <li><NavLink to="/dashboard" className={getNavLinkClass} onClick={closeMenu}>Dashboard</NavLink></li>
                                        <li><NavLink to="/my-data" className={getNavLinkClass} onClick={closeMenu}>Mijn Gegevens</NavLink></li>
                                        <li><NavLink to="/service-hub" className={getNavLinkClass} onClick={closeMenu}>Services</NavLink></li>
                                    </>
                                )}

                                <li className="separator"></li>
                                <li><button onClick={handleLogout} className="btn btn--outline">Uitloggen</button></li>
                            </>
                        ) : (
                            <>
                                <li><NavLink to="/login" className={getNavLinkClass} onClick={closeMenu}>Inloggen</NavLink></li>
                                <li><NavLink to="/register" className="btn btn--primary" onClick={closeMenu}>Registreren</NavLink></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
