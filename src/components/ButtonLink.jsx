/**
 * ButtonLink.jsx - A styled link component that looks like a button.
 */
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * @function ButtonLink
 * @summary Renders a styled link that behaves like a button.
 */
const ButtonLink = ({ to, children, variant = 'primary' }) => {
    return (
        <Link to={to} className={`btn btn--${variant}`}>
            {children}
        </Link>
    );
};

export default ButtonLink;
