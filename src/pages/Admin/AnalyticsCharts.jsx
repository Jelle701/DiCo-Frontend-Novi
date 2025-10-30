/**
 * AnalyticsCharts.jsx - Displays charts for user registration analytics.
 */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css'; // Import the CSS file for styling

/**
 * @function AnalyticsCharts
 * @summary Renders a bar chart showing user registrations per month.
 */
const AnalyticsCharts = ({ users }) => {

    const chartData = useMemo(() => {
        if (!users || users.length === 0) {
            return [];
        }

        const counts = users.reduce((acc, user) => {
            const date = new Date(user.createdAt);
            const monthKey = date.toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' });
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        const monthOrder = ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'];
        
        const sortedKeys = Object.keys(counts).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            if (yearA !== yearB) {
                return parseInt(yearA) - parseInt(yearB);
            }
            return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        });

        return sortedKeys.map(key => ({
            name: key.replace('.', ''),
            Registraties: counts[key],
        }));
    }, [users]);

    return (
        <div className="card">
            <h4 className="card-title mt-0 mb-4">Gebruikersregistraties per Maand</h4>
            {chartData.length > 0 ? (
                <div className="analytics-chart-container">
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis dataKey="name" stroke="var(--gray-300)" fontSize={12} />
                            <YAxis allowDecimals={false} stroke="var(--gray-300)" fontSize={12} />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                contentStyle={{ 
                                    backgroundColor: 'var(--gray-700)', 
                                    border: '1px solid var(--gray-600)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-white)'
                                }} 
                            />
                            <Bar dataKey="Registraties" fill="var(--color-teal)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="d-flex flex-column items-center justify-center bg-800 rounded-md text-400 p-6 analytics-no-data-message">
                    <p>Geen gebruikersdata om weer te geven.</p>
                </div>
            )}
        </div>
    );
};

export default AnalyticsCharts;
