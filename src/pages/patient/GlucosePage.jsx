/**
 * GlucosePage.jsx - Placeholder page for displaying detailed glucose information.
 */
import React from 'react';
import Navbar from '../../components/web components/Navbar.jsx';
import '../../App.css';

/**
 * @function GlucosePage
 * @summary A placeholder component for displaying detailed glucose measurement information.
 */
const GlucosePage = () => {
    return (
        <>
            <Navbar />
            <div className="container pt-6 text-center">
                <h1>Glucose Details</h1>
                <p>Hier komen de details voor de geselecteerde glucosemeting.</p>
                <div className="placeholder-box">
                    <p>Grafiek of data visualisatie komt hier.</p>
                </div>
            </div>
        </>
    );
};

export default GlucosePage;
