/**
 * test.jsx - Component for testing UI elements and styles.
 */
import React, { useState } from "react";
import "./test.css";

const Test = () => {
    const [disabled, setDisabled] = useState(false);

    return (
        <div className="page--dark">
            <header className="navbar">
                <div className="container d-flex w-100 justify-between items-center">
                    <span className="small text-300 header-text-spacing">DICO-STYLE UI • DEMO</span>
                    <div className="d-flex gap-3">
                        <button className="btn btn--ghost" onClick={() => setDisabled((v) => !v)}>
                            Toggle Disabled
                        </button>
                        <a className="btn btn--primary" href="#start">Get Started</a>
                    </div>
                </div>
            </header>

            <section id="start" className="section">
                <div className="container">
                    <div className="demo-hero card">
                        <div className="demo-hero__text">
                            <h1 className="mt-0">Performance Dashboard</h1>
                            <p className="text-100">
                                Test hier je design tokens, typografie, knoppen, badges, formulieren en tabellen.
                                Alles gebruikt uitsluitend je CSS-variabelen en utilities.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <button className="btn btn--primary">Primary CTA</button>
                                <button className="btn" disabled={disabled}>Secondary</button>
                                <button className="btn btn--ghost">Ghost</button>
                            </div>
                        </div>
                        <div className="demo-hero__stats">
                            <div className="demo-stat card shadow-2">
                                <span className="small text-300">Strain</span>
                                <div className="numeric stat">14.2</div>
                                <span className="badge badge--strain mt-3">HIGH</span>
                            </div>
                            <div className="demo-stat card shadow-2">
                                <span className="small text-300">Recovery</span>
                                <div className="numeric stat">82%</div>
                                <span className="badge badge--recovery-high mt-3">GREEN</span>
                            </div>
                            <div className="demo-stat card shadow-2">
                                <span className="small text-300">Sleep</span>
                                <div className="numeric stat">7h 48m</div>
                                <span className="badge badge--sleep mt-3">OK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="mt-0">Cards & Badges</h2>
                    <div className="demo-grid">
                        <div className="card">
                            <h3 className="mt-0">Card Titel</h3>
                            <p className="text-100">Gebruik <code>.card</code> voor panelen met subtiele borders en schaduw.</p>
                            <div className="d-flex gap-2 flex-wrap">
                                <span className="badge badge--recovery-high">Recovery High</span>
                                <span className="badge badge--recovery-med">Recovery Med</span>
                                <span className="badge badge--recovery-low">Recovery Low</span>
                                <span className="badge badge--strain">Strain</span>
                                <span className="badge badge--sleep">Sleep</span>
                            </div>
                        </div>
                        <div className="card">
                            <h3 className="mt-0">Buttons</h3>
                            <p className="text-100">Knoppen met states en animatie.</p>
                            <div className="d-flex gap-3 flex-wrap">
                                <button className="btn btn--primary">Primary</button>
                                <button className="btn" disabled={disabled}>Secondary</button>
                                <button className="btn btn--ghost">Ghost</button>
                                <button className="btn" disabled>Disabled</button>
                            </div>
                        </div>
                        <div className="card">
                            <h3 className="mt-0">Utilities</h3>
                            <p className="text-100">Spacing, radius, shadows en kleuren.</p>
                            <div className="demo-pills">
                                <div className="pill bg-800 rounded-lg shadow-1">bg-800</div>
                                <div className="pill bg-700 rounded-md shadow-2">bg-700</div>
                                <div className="pill rounded-sm">rounded-sm</div>
                            </div>
                            <p className="small text-300 mt-4">Tip: combineer <code>.mt-*</code>, <code>.mb-*</code>, <code>.rounded-*</code>, <code>.shadow-*</code>.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="mt-0">Formulier</h2>
                    <div className="card">
                        <div className="demo-form-grid">
                            <div>
                                <label className="label" htmlFor="email">Email</label>
                                <input id="email" type="email" className="input" placeholder="you@example.com" />
                                <div className="form-help">We delen je email nooit met derden.</div>
                            </div>
                            <div>
                                <label className="label" htmlFor="level">Niveau</label>
                                <select id="level" className="input">
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Pro</option>
                                </select>
                            </div>
                            <div className="full">
                                <label className="label" htmlFor="msg">Bericht</label>
                                <textarea id="msg" className="input" placeholder="Typ je bericht..." />
                                <div className="form-error">Voorbeeld foutmelding</div>
                            </div>
                        </div>
                        <div className="mt-5">
                            <button className="btn btn--primary">Versturen</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section pb-6">
                <div className="container">
                    <h2 className="mt-0">Tabel</h2>
                    <div className="card">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Strain</th>
                                <th>Recovery</th>
                                <th>Sleep</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>01-10-2025</td>
                                <td className="numeric">13.1</td>
                                <td><span className="badge badge--recovery-med">YELLOW</span></td>
                                <td className="numeric">13.1</td>
                                <td><span className="badge badge--recovery-med">YELLOW</span></td>
                                <td className="numeric">7h 10m</td>
                            </tr>
                            <tr>
                                <td>30-09-2025</td>
                                <td className="numeric">15.3</td>
                                <td><span className="badge badge--recovery-low">RED</span></td>
                                <td className="numeric">6h 05m</td>
                            </tr>
                            <tr>
                                <td>29-09-2025</td>
                                <td className="numeric">12.0</td>
                                <td><span className="badge badge--recovery-high">GREEN</span></td>
                                <td className="numeric">8h 02m</td>
                            </tr>
                            </tbody>
                        </table>
                        <p className="small text-300 mt-4">Alle cellen gebruiken je tokens voor spacing, kleuren en borders.</p>
                    </div>
                </div>
            </section>

            <footer className="container mb-6">
                <p className="small text-300">© Demo • Gemaakt om snel je stylesheet te valideren.</p>
            </footer>
        </div>
    );
};

export default Test;
