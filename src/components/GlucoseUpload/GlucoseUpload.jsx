/**
 * GlucoseUpload.jsx - Component for uploading glucose data via a CSV file.
 */
import React, { useState, useRef } from 'react';
import { uploadGlucoseData } from '../../services/DataService.jsx';
import '../../pages/service/ServicesHubPage.css';

/**
 * @function GlucoseUpload
 * @summary Handles CSV file selection and upload for glucose data.
 * @param {object} props - Component props.
 * @param {function} props.onUploadSuccess - Callback function on successful upload.
 */
const GlucoseUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Selecteer een bestand om te uploaden.');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setError(null);
        setSuccess(false);

        const onUploadProgress = (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
        };

        const { data, error: apiError } = await uploadGlucoseData(file, onUploadProgress);

        setUploading(false);

        if (apiError) {
            setError(apiError.message || 'Er is een fout opgetreden bij het uploaden.');
            setSuccess(false);
        } else {
            setSuccess(true);
            setFile(null);
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glucose-upload-form">
            <a href="/glucose_template.csv" download className="btn btn--outline mb-4">Download Template</a>

            <div className="form-group mb-4">
                <div className="file-input-container">
                    <button type="button" onClick={handleButtonClick} className="btn btn--secondary">Kies Bestand</button>
                    <span className="file-name">{file ? file.name : 'Geen bestand gekozen'}</span>
                </div>
                <input 
                    type="file" 
                    id="glucoseFile" 
                    onChange={handleFileChange} 
                    accept=".csv" 
                    ref={fileInputRef} 
                    className="file-input-hidden" 
                />
            </div>

            {uploading && (
                <div className="mt-4">
                    <p>Uploaden... {uploadProgress}%</p>
                    <div className="progress-bar-background">
                        <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            )}

            {error && <p className="form-error mt-4">{error}</p>}
            {success && <p className="form-success mt-4">Bestand succesvol geüpload! De dashboard data wordt ververst.</p>}

            <button type="submit" className="btn btn--primary mt-5" disabled={!file || uploading}>
                {uploading ? 'Bezig met uploaden...' : 'Uploaden'}
            </button>
        </form>
    );
};

export default GlucoseUpload;
