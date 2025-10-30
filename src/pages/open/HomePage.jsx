/**
 * HomePage.jsx - The main landing page of the application.
 */
import React from 'react';
import { Link } from "react-router-dom";
import Navbar from '../../components/web components/Navbar.jsx';
import './HomePage.css';

import heroVideo from '../../content/HomepageVideo.mp4';
import manWithSensor from '../../content/Man met sensor.png';
import graphImage from '../../content/Grafiek.png';
import fatimaImage from '../../content/fatima.png';
import marcoImage from '../../content/marco.png';
import sophieImage from '../../content/sophie.png';
import appImage from '../../content/App.png';

/**
 * @function HomePage
 * @summary Renders the marketing and informational landing page for DiCo.
 */
const HomePage = () => {
    return (
        <div className="homepage">
            <div className="top-banner">
                <p>
                    De nieuwe DiCo ervaring is hier!{' '}
                    <a href="#" className="top-banner-link">Bekijk de video</a>
                </p>
            </div>
            <Navbar />

            <header className="hero-section container">
                <video src={heroVideo} autoPlay muted loop className="hero-video" />
                <div className="hero-content">
                    <h1>Optimaliseer je gezondheid</h1>
                    <h3> Leef jouw leven met volledig vertrouwen</h3>
                    <p className="hero-tagline">Jouw persoonlijke online coach voor diabetesmanagement.</p>
                    <Link to="/register" className="btn btn--primary">
                        verbeter nu jouw leven
                    </Link>
                    <div className="hero-highlights d-flex gap-5 flex-wrap justify-center mt-6">
                        <span className="small text-300">Realtime Inzicht</span>
                        <span className="small text-300">Gepersonaliseerde Aanbevelingen</span>
                        <span className="small text-300">Veilig Delen</span>
                    </div>
                </div>
            </header>

            <section id="features" className="features-section container">
                <div className="features-grid">
                    <div className="feature-text">
                        <h3>Volledige controle over je glucosewaarden</h3>
                        <p>DiCo integreert naadloos met je glucosemeters en sensoren, zodat je een compleet overzicht hebt van je bloedsuikerspiegel. Begrijp patronen en reageer proactief.</p>
                        <ul>
                            <li>Realtime data-synchronisatie.</li>
                            <li>Interactieve grafieken en trends.</li>
                            <li>Waarschuwingen bij afwijkende waarden.</li>
                        </ul>
                    </div>
                    <div className="feature-image-wrapper">
                        <img className="feature-img" src={manWithSensor} alt="Man met een glucose sensor" />
                    </div>
                </div>

                <div className="features-grid reverse">
                    <div className="feature-text">
                        <h3>Gepersonaliseerd Medicatiebeheer</h3>
                        <p>Ontvang slimme herinneringen voor je insuline en andere medicatie. DiCo leert van je routine en past zich aan jouw leven aan.</p>
                        <ul>
                            <li>Aanpasbare medicatieschema's.</li>
                            <li>Dosis-tracking en rapportage.</li>
                        </ul>
                    </div>
                    <div className="feature-image-wrapper">
                        <img className="feature-img" src={graphImage} alt="Grafiek van glucosewaarden" />
                    </div>
                </div>

                <div className="features-grid">
                    <div className="feature-text">
                        <h3>Jouw levensstijl, jouw controle.</h3>
                        <p>Registreer je voeding, beweging en slaap om te zien hoe deze factoren je glucose beïnvloeden. Ontdek correlaties en maak gezondere keuzes.</p>
                        <ul>
                            <li>Voedingsdagboek met macro-analyse.</li>
                            <li>Activiteiten-tracking en doelen.</li>
                            <li>Slaapkwaliteit monitoring.</li>
                        </ul>
                    </div>
                    <div className="feature-image-wrapper">
                        <img className="feature-img" src={appImage} alt="DiCo app op telefoon" />
                    </div>
                </div>
            </section>

            <section className="data-impact-section section">
                <div className="container text-center">
                    <h2>DiCo in Cijfers</h2>
                    <p className="auth-form-description">Ontdek de impact die DiCo heeft op het leven van onze gebruikers.</p>
                    <div className="metrics-grid d-flex gap-6 justify-center flex-wrap mt-6">
                        <div className="metric-card card">
                            <div className="numeric stat">85%</div>
                            <p className="small text-300">Stabielere glucosewaarden</p>
                        </div>
                        <div className="metric-card card">
                            <div className="numeric stat">2 uur</div>
                            <p className="small text-300">Minder tijd aan handmatige logging</p>
                        </div>
                        <div className="metric-card card">
                            <div className="numeric stat">92%</div>
                            <p className="small text-300">Zorgverleners bevelen DiCo aan</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials-section section">
                <div className="container">
                    <h2>Nog niet overtuigd?</h2>
                    <div className="testimonials-grid d-flex gap-6 justify-center flex-wrap mt-6">
                        <blockquote className="testimonial card">
                            <img src={sophieImage} alt="Sophie" className="testimonial-avatar" />
                            <p>"Sinds ik DiCo gebruik zijn mijn waardes stabieler dan ooit."</p>
                            <footer>- Sophie, 42</footer>
                        </blockquote>
                        <blockquote className="testimonial card">
                            <img src={marcoImage} alt="Marco" className="testimonial-avatar" />
                            <p>"De app motiveert me dagelijks om gezondere keuzes te maken."</p>
                            <footer>- Marco, 35</footer>
                        </blockquote>
                        <blockquote className="testimonial card">
                            <img src={fatimaImage} alt="Fatima" className="testimonial-avatar" />
                            <p>"De integratie met mijn zorgverlener heeft mijn behandeling echt verbeterd."</p>
                            <footer>- Fatima, 58</footer>
                        </blockquote>
                    </div>
                </div>
            </section>

            <section className="cta-section section">
                <div className="container">
                    <h2>Klaar om de controle terug te nemen?</h2>
                    <p className="auth-form-description">Sluit je aan bij duizenden gebruikers die hun diabetesmanagement transformeren met DiCo's slimme inzichten en gepersonaliseerde ondersteuning.</p>
                    <div className="d-flex gap-4 justify-center mt-6">
                        <Link to="/register" className="btn btn--primary">
                            verbeter nu jouw leven
                        </Link>
                        <button disabled className="btn btn--ghost" title="Deze functie komt later">
                            Ontdek Meer
                        </button>
                    </div>
                </div>
            </section>

            <footer className="main-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} DiCo – Alle rechten voorbehouden</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
