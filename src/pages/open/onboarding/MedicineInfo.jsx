/**
 * MedicineInfo.jsx - Onboarding step for users to provide their diabetes and medication information.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import medicatieData from '../../../Data/MedicatieDataSet.json';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css';

/**
 * @constant DIABETES_TYPES
 * @summary Array of available diabetes types for selection.
 */
const DIABETES_TYPES = [
    { value: 'TYPE_1', label: 'Type 1' },
    { value: 'TYPE_2', label: 'Type 2' },
    { value: 'LADA', label: 'LADA' },
    { value: 'MODY', label: 'MODY' },
    { value: 'GESTATIONAL', label: 'Zwangerschapsdiabetes' },
    { value: 'OTHER', label: 'Anders/Onbekend' },
];

/**
 * @function MedicineInfo
 * @summary Allows users to input their diabetes type, glucose measurement unit, and insulin usage.
 */
const MedicineInfo = () => {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    const { longManufacturers, shortManufacturers, insulinsByManufacturer } = useMemo(() => {
        const long = new Set();
        const short = new Set();
        const byManufacturer = {};

        const longTypes = ["Long-acting", "Ultra-long acting", "Intermediate"];
        const shortTypes = ["Short-acting", "Rapid-acting", "Ultra-rapid"];

        medicatieData.forEach(item => {
            if (!byManufacturer[item.Fabrikant]) {
                byManufacturer[item.Fabrikant] = [];
            }
            byManufacturer[item.Fabrikant].push(item.Merknaam);

            const type = item.Type || '';
            if (longTypes.some(t => type.includes(t))) {
                long.add(item.Fabrikant);
            } else if (shortTypes.some(t => type.includes(t))) {
                short.add(item.Fabrikant);
            }
        });

        return {
            longManufacturers: Array.from(long).sort(),
            shortManufacturers: Array.from(short).sort(),
            insulinsByManufacturer: byManufacturer,
        };
    }, []);

    const [formData, setFormData] = useState({
        eenheid: onboardingData.medicineInfo?.eenheid || 'mmol/L',
        diabetesType: onboardingData.medicineInfo?.diabetesType || '',
        gebruiktInsuline: onboardingData.medicineInfo?.gebruiktInsuline || 'nee',
        longActing: onboardingData.medicineInfo?.longActing || { manufacturer: '', insulin: '', },
        shortActing: onboardingData.medicineInfo?.shortActing || { manufacturer: '', insulin: '', },
    });
    const [error, setError] = useState('');

    /**
     * @function handleChange
     * @summary Handles changes for insulin manufacturer and type selections.
     */
    const handleChange = (e, category, field) => {
        const { value } = e.target;
        setFormData(prevState => {
            const updatedCategory = { ...prevState[category], [field]: value };
            if (field === 'manufacturer') {
                updatedCategory.insulin = '';
            }
            return { ...prevState, [category]: updatedCategory };
        });
    };
    
    /**
     * @function handleTopLevelChange
     * @summary Handles changes for top-level form fields like diabetes type or unit.
     */
    const handleTopLevelChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * @function handleSubmit
     * @summary Validates form data, updates onboarding context, and navigates to the next step.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.diabetesType) {
            setError('Selecteer alsjeblieft je type diabetes.');
            return;
        }
        updateOnboardingData({ medicineInfo: formData });
        navigate('/onboarding/devices');
    };

    /**
     * @function renderInsulinSelector
     * @summary Renders dropdowns for selecting insulin manufacturer and type.
     */
    const renderInsulinSelector = (type, label, manufacturers) => {
        const category = type === 'long' ? 'longActing' : 'shortActing';
        const selectedManufacturer = formData[category].manufacturer;
        const availableInsulins = selectedManufacturer ? (insulinsByManufacturer[selectedManufacturer] || []) : [];

        return (
            <div className="device-category-box mt-0">
                <h2>{label}</h2>
                <div className="input-group">
                    <label htmlFor={`${category}-manufacturer`}>Fabrikant</label>
                    <select id={`${category}-manufacturer`} value={selectedManufacturer} onChange={(e) => handleChange(e, category, 'manufacturer')}>
                        <option value="">-- Kies Fabrikant --</option>
                        {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor={`${category}-insulin`}>Insulinesoort</label>
                    <select id={`${category}-insulin`} value={formData[category].insulin} onChange={(e) => handleChange(e, category, 'insulin')} disabled={!selectedManufacturer}>
                        <option value="">-- Kies Insuline --</option>
                        {availableInsulins.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <form onSubmit={handleSubmit}>
                        <h1>Medische Informatie</h1>
                        <p className="auth-form-description">Deze informatie helpt ons om de app beter op jou af te stemmen.</p>
                        
                        <div className="input-group">
                            <label>Eenheid voor glucosemeting</label>
                            <select name="eenheid" value={formData.eenheid} onChange={handleTopLevelChange}>
                                <option value="mmol/L">mmol/L</option>
                                <option value="mg/dL">mg/dL</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="diabetesType">Welk type diabetes heb je?</label>
                            <select id="diabetesType" name="diabetesType" value={formData.diabetesType} onChange={handleTopLevelChange} required>
                                <option value="" disabled>-- Maak een keuze --</option>
                                {DIABETES_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}                            
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Gebruik je insuline?</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="gebruiktInsuline" value="ja" checked={formData.gebruiktInsuline === 'ja'} onChange={handleTopLevelChange} />
                                    <span>Ja</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="gebruiktInsuline" value="nee" checked={formData.gebruiktInsuline === 'nee'} onChange={handleTopLevelChange} />
                                    <span>Nee</span>
                                </label>
                            </div>
                        </div>

                        {formData.gebruiktInsuline === 'ja' && (
                            <div className="d-flex flex-column gap-5">
                                {renderInsulinSelector('long', 'Langwerkende Insuline', longManufacturers)}
                                {renderInsulinSelector('short', 'Kortwerkende Insuline', shortManufacturers)}
                            </div>
                        )}

                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="btn btn--primary form-action-button">Volgende stap</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MedicineInfo;
