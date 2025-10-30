/**
 * ActivityFeed.jsx - Displays a list of recent administrative activities.
 */
import React, { useState, useEffect } from 'react';
import { getRecentActivities } from '../../services/AdminService';

/**
 * @function getActivityIcon
 * @summary Returns an emoji icon based on the activity type.
 */
const getActivityIcon = (type) => {
    switch (type) {
        case 'USER_REGISTRATION': return '👤';
        case 'USER_DELETION': return '🗑️';
        case 'ROLE_CHANGE': return '🔄';
        default: return '🔔';
    }
};

/**
 * @function TimeAgo
 * @summary Displays a human-readable time difference from a given timestamp.
 */
const TimeAgo = ({ timestamp }) => {
    const time = new Date(timestamp);
    const seconds = Math.floor((new Date() - time) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " jaar geleden";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " maanden geleden";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dagen geleden";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " uur geleden";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minuten geleden";
    return Math.floor(seconds) + " seconden geleden";
};

/**
 * @function ActivityFeed
 * @summary Fetches and displays recent activities for administrators.
 */
const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            const { data, error: apiError } = await getRecentActivities();
            if (apiError) {
                setError(apiError.message || 'Fout bij het ophalen van activiteiten.');
            } else {
                setActivities(data || []);
            }
            setLoading(false);
        };

        fetchActivities();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p className="text-300">Activiteiten laden...</p>;
        }

        if (error) {
            return <p className="form-error">{error}</p>;
        }

        if (activities.length === 0) {
            return <p className="text-300">Geen recente activiteiten gevonden.</p>;
        }

        return (
            <ul className="activity-list">
                {activities.map(activity => (
                    <li key={activity.id} className="activity-item">
                        <div className="activity-icon text-teal">{getActivityIcon(activity.type)}</div>
                        <div>
                            <p className="activity-description mb-1">{activity.description}</p>
                            <span className="activity-timestamp small text-400"><TimeAgo timestamp={activity.timestamp} /></span>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="card activity-feed">
            <h4 className="card-title mt-0 mb-4">Recente Activiteit</h4>
            {renderContent()}
        </div>
    );
};

export default ActivityFeed;
