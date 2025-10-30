/**
 * App.jsx - Main application component defining routes and lazy-loaded pages.
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import PublicRoute from "./components/Routes/PublicRoute.jsx";
import PrivateRoute from "./components/Routes/PrivateRoute.jsx";
import AdminRoute from './components/Routes/AdminRoute.jsx';

const Test = lazy(() => import('./Test/test.jsx'));

// Page Imports (Lazily Loaded)
const HomePage = lazy(() => import('./pages/open/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/open/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/patient/DashboardPage.jsx'));
const MyDataPage = lazy(() => import('./pages/patient/MyDataPage.jsx'));
const GlucoseLogPage = lazy(() => import('./pages/patient/GlucoseLogPage.jsx'));
const ServiceHubPage = lazy(() => import('./pages/service/ServiceHubPage.jsx'));
const LibreViewLoginPage = lazy(() => import('./pages/service/LibreViewLoginPage.jsx'));
const LibreViewTestPage = lazy(() => import('./pages/service/LibreViewTestPage.jsx'));

// Onboarding Pages
const RegisterPage = lazy(() => import('./pages/open/onboarding/RegisterPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/open/onboarding/VerifyEmailPage.jsx'));
const SelectRolePage = lazy(() => import('./pages/open/onboarding/SelectRolePage.jsx'));
const OnboardingPreferences = lazy(() => import('./pages/open/onboarding/OnboardingPreferences.jsx'));
const MedicineInfo = lazy(() => import('./pages/open/onboarding/MedicineInfo.jsx'));
const DiabeticDevices = lazy(() => import('./pages/open/onboarding/DiabeticDevices.jsx'));

// Guardian Pages
const GuardianPortal = lazy(() => import('./pages/Guardian/GuardianPortal.jsx'));
const GuardianPatientDetail = lazy(() => import('./pages/Guardian/GuardianPatientDetail.jsx'));

// Provider Pages
const PatientPortal = lazy(() => import('./pages/Provider/PatientPortal.jsx'));
const ProviderDashboard = lazy(() => import('./pages/Provider/ProviderDashboard.jsx'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));

const LoadingFallback = () => <div className="loading-fallback-message">Laden...</div>;

function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/verify" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
                <Route path="/test" element={<PublicRoute><Test /></PublicRoute>} />

                {/* Private Routes (require authentication) */}
                <Route element={<PrivateRoute />}>
                    <Route path="/register-details" element={<Navigate to="/onboarding/role" replace />} />

                    {/* Onboarding Flow */}
                    <Route path="/onboarding/role" element={<SelectRolePage />} />
                    <Route path="/onboarding/preferences" element={<OnboardingPreferences />} />
                    <Route path="/onboarding/medicine" element={<MedicineInfo />} />
                    <Route path="/onboarding/devices" element={<DiabeticDevices />} />
                    
                    {/* Core Application */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/glucose-log" element={<GlucoseLogPage />} />
                    <Route path="/my-data" element={<MyDataPage />} />
                    <Route path="/service-hub" element={<ServiceHubPage />} />
                    <Route path="/service-hub/libreview-login" element={<LibreViewLoginPage />} />
                    <Route path="/libreview-test" element={<LibreViewTestPage />} />
                    
                    {/* Guardian Routes */}
                    <Route path="/guardian-portal" element={<GuardianPortal />} />
                    <Route path="/guardian/patient/:patientId" element={<GuardianPatientDetail />} />

                    {/* Provider Routes */}
                    <Route path="/patient-portal" element={<PatientPortal />} />
                    <Route path="/provider-dashboard" element={<ProviderDashboard />} />

                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/admin-dashboard#management" element={<AdminDashboard />} />
                        <Route path="/admin/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
                        <Route path="/admin/management" element={<Navigate to="/admin-dashboard#management" replace />} />
                    </Route>
                </Route>

                {/* Catch-all Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
