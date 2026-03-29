'use client';

import { PHASES, LOCATIONS } from '@/lib/data';

export default function PhasesPanel({ activePhase, onSetPhase, isActive }) {
  const phase = PHASES.find(p => p.id === activePhase);

  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Kliknite na fazu i vidite kako svaka lokacija stoji</div>
      <div className="timeline-wrap">
        <div className="phases-row">
          {PHASES.map(ph => (
            <div
              key={ph.id}
              className={`phase-btn${ph.id === activePhase ? ' active' : ''}`}
              onClick={() => onSetPhase(ph.id)}
            >
              <span className="ph-icon">{ph.icon}</span>
              <span className="ph-title">{ph.title}</span>
              <span className="ph-years">{ph.years}</span>
            </div>
          ))}
        </div>

        {PHASES.map(ph => (
          <div key={ph.id} className={`phase-detail${ph.id === activePhase ? ' active' : ''}`}>
            <h3>
              {ph.icon} {ph.title}{' '}
              <small style={{ fontSize: '0.7em', color: 'var(--muted)', fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
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
    </div>
  );
}
