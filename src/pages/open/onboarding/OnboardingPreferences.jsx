/**
 * OnboardingPreferences.jsx - Onboarding step for users to provide personal and physical information.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css';

/**
 * @function OnboardingPreferences
 * @summary Allows users to input their personal details, such as name, date of birth, gender, weight, and height.
 */
const OnboardingPreferences = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [formData, setFormData] = useState({
        firstName: onboardingData.preferences?.firstName || '',
        lastName: onboardingData.preferences?.lastName || '',
        geslacht: onboardingData.preferences?.geslacht || '',
        gewicht: onboardingData.preferences?.gewicht || '',
        lengte: onboardingData.preferences?.lengte || '',
        dateOfBirth: onboardingData.preferences?.dateOfBirth || ''
    });
    const [bmi, setBmi] = useState(null);
    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        const { gewicht, lengte } = formData;
        if (gewicht > 0 && lengte > 0) {
            const lengteInMeters = lengte / 100;
            const calculatedBmi = (gewicht / (lengteInMeters * lengteInMeters)).toFixed(1);
            setBmi(calculatedBmi);
        } else {
            setBmi(null);
        }
    }, [formData.gewicht, formData.lengte]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const gewichtNum = parseFloat(formData.gewicht);
        const lengteNum = parseFloat(formData.lengte);
        const birthDate = new Date(formData.dateOfBirth);
        const minBirthDate = new Date('1900-01-01');
        const currentDate = new Date();

        if (birthDate > currentDate) {
            setError('Geboortedatum kan niet in de toekomst liggen.');
            return;
        }
        if (birthDate < minBirthDate) {
            setError('Geboortedatum lijkt onrealistisch. Controleer het jaartal.');
            return;
        }

        if (gewichtNum < 20 || gewichtNum > 250) {
            setError('Gewicht moet tussen 20 en 250 kg zijn.');
            return;
        }

        if (lengteNum < 50 || lengteNum > 300) {
            setError('Lengte moet tussen 50 en 300 cm zijn.');
            return;
        }

        updateOnboardingData({ preferences: formData });
        navigate('/onboarding/medicine');
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <form onSubmit={handleSubmit}>
                        <h1>Persoonlijke Gegevens</h1>
                        <p className="auth-form-description">Deze gegevens helpen ons om de informatie beter op uw situatie af te stemmen.</p>

                        <div className="input-group">
                            <label htmlFor="firstName">Voornaam</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="bv. Jan" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Achternaam</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="bv. Jansen" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="dateOfBirth">Geboortedatum</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required max={today} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="geslacht">Geslacht</label>
                            <select id="geslacht" name="geslacht" value={formData.geslacht} onChange={handleChange} required>
                                <option value="" disabled>-- Maak een keuze --</option>
                                <option value="Man">Man</option>
                                <option value="Vrouw">Vrouw</option>
                                <option value="Anders">Anders</option>
                                <option value="Zeg ik liever niet">Zeg ik liever niet</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="gewicht">Gewicht (kg)</label>
                            <input type="number" id="gewicht" name="gewicht" value={formData.gewicht} onChange={handleChange} required placeholder="bv. 75" min="20" max="250" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lengte">Lengte (cm)</label>
                            <input type="number" id="lengte" name="lengte" value={formData.lengte} onChange={handleChange} required placeholder="bv. 180" min="50" max="300" />
                        </div>

                        {bmi && <p className="text-center mt-neg-5">Je berekende BMI is: <strong>{bmi}</strong></p>}
                        
                        {error && <p className="error-message">{error}</p>} 
                        <button type="submit" className="btn btn--primary form-action-button">Volgende stap</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default OnboardingPreferences;
