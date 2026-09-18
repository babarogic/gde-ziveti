'use client';

import { PHASES, LOCATIONS } from '@/lib/data';

export default function PhasesPanel({ activePhase, onSetPhase, isActive }) {
  const phase = PHASES.find(p => p.id === activePhase);

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="phases-title">
      <h2 className="slabel" id="phases-title">Izaberite fazu i pogledajte kako svaka lokacija stoji</h2>
      <div className="timeline-wrap">
        <div className="phases-row">
          {PHASES.map(ph => (
            <button
              type="button"
              key={ph.id}
              className={`phase-btn${ph.id === activePhase ? ' active' : ''}`}
              onClick={() => onSetPhase(ph.id)}
              aria-pressed={ph.id === activePhase}
            >
              <span className="ph-icon" aria-hidden="true">{ph.icon}</span>
              <span className="ph-title">{ph.title}</span>
              <span className="ph-years">{ph.years}</span>
            </button>
          ))}
        </div>

        {PHASES.map(ph => (
          <div key={ph.id} className={`phase-detail${ph.id === activePhase ? ' active' : ''}`}>
            <h3>
              {ph.icon} {ph.title}{' '}
              <small style={{ fontSize: '0.7em', color: 'var(--muted)', fontFamily: "'Outfit', sans-serif", fontWeight: 400 }}>
                {ph.years}
              </small>
            </h3>
            <p className="ph-desc">{ph.desc}</p>
            <div className="phase-grid">
              {LOCATIONS.map(loc => (
                <div key={loc.id} className="phase-loc-card">
                  <h4>{loc.name.split('—')[0].trim()}</h4>
                  {ph.locs[loc.id].map(([cls, txt], i) => (
                    <div key={i} className={`phase-item ${cls}`}>{txt}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
