/**
 * DiabeticRapportValues.jsx - Displays a summary of diabetic values and metrics.
 */
import React from "react";
import PropTypes from "prop-types";
import "./DiabeticRapportValues.css";

const DEFAULT_TARGETS = {
  tirInRangeMinPct: 70,
  cvMaxPct: 36,
  ppgMax: 9, // mmol/L
  fpgMin: 4,
  fpgMax: 7,
};

/**
 * @function mgdlToMmol
 * @summary Converts mg/dL to mmol/L.
 */
function mgdlToMmol(x) {
  return x / 18;
}

/**
 * @function calcEagFromHbA1cPercent
 * @summary Calculates eAG from HbA1c percentage.
 */
function calcEagFromHbA1cPercent(hba1cPercent) {
  const eAGmgdl = 28.7 * hba1cPercent - 46.7;
  const eAGmmol = mgdlToMmol(eAGmgdl);
  return { mgdl: round(eAGmgdl, 0), mmol: round(eAGmmol, 1) };
}

/**
 * @function calcGmiFromAvgGlucose
 * @summary Calculates GMI from average glucose in mg/dL.
 */
function calcGmiFromAvgGlucose(avgGlucoseMgdl) {
    if (avgGlucoseMgdl == null) return null;
    const gmi = 3.31 + (0.02392 * avgGlucoseMgdl);
    return round(gmi, 1);
}

/**
 * @function round
 * @summary Rounds a number to a specified decimal place.
 */
function round(num, dp = 1) {
  const f = Math.pow(10, dp);
  return (Math.round(num * f) / f).toFixed(dp);
}

/**
 * @function statusBadge
 * @summary Renders a status badge with a given kind and label.
 */
function statusBadge(
  kind,
  label
) {
  return (
    <span
      className={`dr-badge dr-badge--${kind}`}
      aria-label={label}
      title={label}
    >
      {label}
    </span>
  );
}

/**
 * @function sectionVisible
 * @summary Checks if a section should be visible.
 */
function sectionVisible(
  key,
  show
) {
  return !show || show.includes(key);
}

/**
 * @function EmptyValue
 * @summary Placeholder component for empty data values.
 */
const EmptyValue = () => <div className="dr-tile__sub">Geen gegevens</div>;

/**
 * @function DiabeticRapportValues
 * @summary Main component to display various diabetic health metrics.
 */
const DiabeticRapportValues = ({
  title = "Diabetessamenvatting",
  data,
  targetRanges,
  density = "comfortable",
  showSections,
  onTileClick,
}) => {
  const targets = { ...DEFAULT_TARGETS, ...(targetRanges || {}) };
  const densityClass = density === "compact" ? "dr--compact" : "dr--comfortable";

  const handleTileClick = (section) => {
    if (onTileClick) onTileClick(section);
  };

  const tirStatus = (tir) => {
    if (!tir) return null;
    const inRange = tir.inRangePct;
    if (inRange >= targets.tirInRangeMinPct) return statusBadge("ok", "Binnen doel");
    if (inRange >= targets.tirInRangeMinPct - 10) return statusBadge("warn", "Bijna doel");
    return statusBadge("alert", "Buiten doel");
  };

  const cvStatus = (cvPct) => {
    if (cvPct == null) return null;
    if (cvPct <= targets.cvMaxPct) return statusBadge("ok", "Stabiel");
    if (cvPct <= targets.cvMaxPct + 5) return statusBadge("warn", "Let op");
    return statusBadge("alert", "Variabel");
    };
  
  const valueStatus = (value, min, max) => {
    if (min != null && value < min) return statusBadge("alert", "Te laag");
    if (max != null && value > max) return statusBadge("alert", "Te hoog");

    if (min != null && max != null) {
        const range = max - min;
        if (range > 0 && (value < min + range * 0.1 || value > max - range * 0.1)) {
            return statusBadge("warn", "Rand");
        }
    }
    return statusBadge("ok", "Binnen doel");
  };

  const fpgMmol =
    data.fpg?.value != null
      ? data.fpg.unit === "mg/dL"
        ? mgdlToMmol(data.fpg.value)
        : data.fpg.value
      : undefined;

  const ppgMmol =
    data.ppg?.value != null
      ? data.ppg.unit === "mg/dL"
        ? mgdlToMmol(data.ppg.value)
        : data.ppg.value
      : undefined;

  const eAG =
    data.hbA1c?.unit === "%" && data.hbA1c.value != null
      ? calcEagFromHbA1cPercent(data.hbA1c.value)
      : null;

  const avgGlucose90d = data.avgGlucose?.values['90d'];
  const avgGlucose90dMgdl = data.avgGlucose?.unit === 'mmol/L' && avgGlucose90d != null ? avgGlucose90d * 18 : avgGlucose90d;
  const gmi = calcGmiFromAvgGlucose(avgGlucose90dMgdl);

  return (
    <section className={`card bg-800 ${densityClass}`} aria-live="polite">
      <header className="dr-card__header">
        <h2 className="dr-card__title">{title}</h2>
        {data.updatedAt && (
          <time
            className="dr-card__meta"
            dateTime={data.updatedAt}
            title={new Date(data.updatedAt).toLocaleString()}
          >
            Laatst bijgewerkt:{" "}
            {new Date(data.updatedAt).toLocaleDateString()}
          </time>
        )}
      </header>

      <div className="dr-grid">
        {sectionVisible("hbA1c", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("hbA1c")}
            aria-label="HbA1c"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    <span className="dr-tile__title">HbA1c</span>
                </div>
            </div>
            {data.hbA1c ? (
              <>
                <div className="dr-tile__value">
                  {data.hbA1c.value} {data.hbA1c.unit}
                </div>
                {eAG && (
                  <div className="dr-tile__sub">
                    eAG: {eAG.mmol} mmol/L ({eAG.mgdl} mg/dL)
                  </div>
                )}
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("gmi", showSections) && (
            <button
                type="button"
                className="dr-tile"
                onClick={() => handleTileClick("gmi")}
                aria-label="Glucose Management Indicator"
            >
                <div className="dr-tile__head">
                    <div className="dr-tile__title-container">
                        <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="dr-tile__title">GMI</span>
                    </div>
                </div>
                {gmi ? (
                    <>
                        <div className="dr-tile__value">{gmi}%</div>
                        <div className="dr-tile__sub">Geschat op basis van 90d gemiddelde</div>
                    </>
                ) : <EmptyValue />}
            </button>
        )}

        {sectionVisible("avgGlucose", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("avgGlucose")}
            aria-label="Gemiddelde glucose"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
                    <span className="dr-tile__title">Gemiddelde glucose</span>
                </div>
            </div>
            {data.avgGlucose && Object.keys(data.avgGlucose.values).length > 0 ? (
              <div className="dr-avglist" role="list" aria-label="Gemiddelden per periode">
                {([ "7d", "14d", "30d", "90d", "180d"]).map((k) =>
                  data.avgGlucose.values[k] != null ? (
                    <div key={k} className="dr-avglist__row" role="listitem">
                      <span className="dr-avglist__key">{k}</span>
                      <span className="dr-avglist__value">
                        {round(data.avgGlucose.values[k], 1)} {data.avgGlucose.unit}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("timeInRange", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("timeInRange")}
            aria-label="Time in Range"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="dr-tile__title">Time in Range</span>
                </div>
              {data.timeInRange && <span className="dr-tile__status">{tirStatus(data.timeInRange)}</span>}
            </div>
            {data.timeInRange ? (
              <>
                <div className="dr-tile__value">
                  {data.timeInRange.inRangePct}% in bereik
                </div>
                <div className="tir-bar">
                    <div className="tir-bar__segment tir-bar__segment--below" style={{ width: `${data.timeInRange.belowRangePct}%` }} title={`Te laag: ${data.timeInRange.belowRangePct}%`}></div>
                    <div className="tir-bar__segment tir-bar__segment--in-range" style={{ width: `${data.timeInRange.inRangePct}%` }} title={`In bereik: ${data.timeInRange.inRangePct}%`}></div>
                    <div className="tir-bar__segment tir-bar__segment--above" style={{ width: `${data.timeInRange.aboveRangePct}%` }} title={`Te hoog: ${data.timeInRange.aboveRangePct}%`}></div>
                </div>
                <div className="dr-tile__sub">
                  {data.timeInRange.belowRangePct}% laag · {data.timeInRange.aboveRangePct}% hoog
                </div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("cvPct", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("cvPct")}
            aria-label="Glucosevariabiliteit"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <span className="dr-tile__title">Variabiliteit (CV)</span>
                </div>
              {data.cvPct != null && <span className="dr-tile__status">{cvStatus(data.cvPct)}</span>}
            </div>
            {data.cvPct != null ? (
              <>
                <div className="dr-tile__value">{round(data.cvPct, 0)}%</div>
                <div className="dr-tile__sub">Doel: ≤ {DEFAULT_TARGETS.cvMaxPct}%</div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("fpg", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("fpg")}
            aria-label="Nuchtere glucose"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    <span className="dr-tile__title">Nuchter (FPG)</span>
                </div>
              {fpgMmol != null && (
                <span className="dr-tile__status">
                  {valueStatus(fpgMmol, targets.fpgMin, targets.fpgMax)}
                </span>
              )}
            </div>
            {data.fpg ? (
              <>
                <div className="dr-tile__value">
                  {data.fpg.value} {data.fpg.unit}
                </div>
                <div className="dr-tile__sub">
                  Doel: {targets.fpgMin}–{targets.fpgMax} mmol/L
                </div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("ppg", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("ppg")}
            aria-label="Postprandiale glucose"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M3 20a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14z" /></svg>
                    <span className="dr-tile__title">Na maaltijd (PPG)</span>
                </div>
              {ppgMmol != null && (
                <span className="dr-tile__status">
                  {valueStatus(ppgMmol, undefined, targets.ppgMax)}
                </span>
              )}
            </div>
            {data.ppg ? (
              <>
                <div className="dr-tile__value">
                  {data.ppg.value} {data.ppg.unit}
                </div>
                <div className="dr-tile__sub">
                  {data.ppg.atMinutes ? `${data.ppg.atMinutes} min · ` : ""}Doel: ≤ {targets.ppgMax} mmol/L
                </div>
              </>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("ketones", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("ketones")}
            aria-label="Ketonen"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" /></svg>
                    <span className="dr-tile__title">Ketonen</span>
                </div>
            </div>
            {data.ketones ? (
              <div className="dr-tile__value">
                {data.ketones.value} {data.ketones.unit}
              </div>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("lifestyle", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("lifestyle")}
            aria-label="Leefstijl"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="dr-tile__title">Leefstijl</span>
                </div>
            </div>
            {data.lifestyle && Object.keys(data.lifestyle).length > 0 ? (
              <div className="dr-list">
                {data.lifestyle.carbsPerDayGrams != null && (
                  <div className="dr-list__row"><span>Koolhydraten</span><span>{data.lifestyle.carbsPerDayGrams} g/dag</span></div>
                )}
                {data.lifestyle.activityMinutes != null && (
                  <div className="dr-list__row"><span>Beweging</span><span>{data.lifestyle.activityMinutes} min/dag</span></div>
                )}
                {data.lifestyle.sleepHours != null && (
                  <div className="dr-list__row"><span>Slaap</span><span>{round(data.lifestyle.sleepHours, 1)} u</span></div>
                )}
                {data.lifestyle.sleepQualityPct != null && (
                  <div className="dr-list__row"><span>Slaapkwaliteit</span><span>{round(data.lifestyle.sleepQualityPct, 0)}%</span></div>
                )}
                {data.lifestyle.stressScore != null && (
                  <div className="dr-list__row"><span>Stress</span><span>{data.lifestyle.stressScore}/10</span></div>
                )}
              </div>
            ) : <EmptyValue />}
          </button>
        )}

        {sectionVisible("vitals", showSections) && (
          <button
            type="button"
            className="dr-tile"
            onClick={() => handleTileClick("vitals")}
            aria-label="Vitale waarden"
          >
            <div className="dr-tile__head">
                <div className="dr-tile__title-container">
                    <svg className="dr-tile__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <span className="dr-tile__title">Vitale waarden</span>
                </div>
            </div>
            {data.vitals && Object.keys(data.vitals).length > 0 ? (
              <div className="dr-list">
                {data.vitals.systolic != null && data.vitals.diastolic != null && (
                  <div className="dr-list__row"><span>Bloeddruk</span><span>{data.vitals.systolic}/{data.vitals.diastolic} mmHg</span></div>
                )}
                {data.vitals.weightKg != null && (
                  <div className="dr-list__row"><span>Gewicht</span><span>{round(data.vitals.weightKg, 1)} kg</span></div>
                )}
              </div>
            ) : <EmptyValue />}
          </button>
        )}
      </div>

      <footer className="dr-card__footer">
        <p className="dr-footnote">
          TIR = Time in Range (3.9–10 mmol/L). CV &le; {DEFAULT_TARGETS.cvMaxPct}% = stabielere glucose.
        </p>
      </footer>
    </section>
  );
};

DiabeticRapportValues.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    hbA1c: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['%', 'mmol/mol'])
    }),
    avgGlucose: PropTypes.shape({
      unit: PropTypes.oneOf(['mmol/L', 'mg/dL']),
      values: PropTypes.objectOf(PropTypes.number)
    }),
    timeInRange: PropTypes.shape({
      inRangePct: PropTypes.number,
      belowRangePct: PropTypes.number,
      aboveRangePct: PropTypes.number
    }),
    cvPct: PropTypes.number,
    fpg: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['mmol/L', 'mg/dL'])
    }),
    ppg: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['mmol/L', 'mg/dL']),
      atMinutes: PropTypes.number
    }),
    ketones: PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.oneOf(['mmol/L'])
    }),
    lifestyle: PropTypes.shape({
        carbsPerDayGrams: PropTypes.number,
        activityMinutes: PropTypes.number,
        sleepHours: PropTypes.number,
        sleepQualityPct: PropTypes.number,
        stressScore: PropTypes.number,
    }),
    vitals: PropTypes.shape({
        systolic: PropTypes.number,
        diastolic: PropTypes.number,
        weightKg: PropTypes.number,
    }),
    updatedAt: PropTypes.string
  }).isRequired,
  targetRanges: PropTypes.shape({
    tirInRangeMinPct: PropTypes.number,
    cvMaxPct: PropTypes.number,
    ppgMax: PropTypes.number,
    fpgMin: PropTypes.number,
    fpgMax: PropTypes.number
  }),
  density: PropTypes.oneOf(['comfortable', 'compact']),
  showSections: PropTypes.arrayOf(PropTypes.string),
  onTileClick: PropTypes.func
};

export default DiabeticRapportValues;

