'use client';

import { PHASES } from '@/lib/data';

export default function PhasesPanel({ activePhase, onSetPhase, isActive }) {
  const phase = PHASES.find(p => p.id === activePhase);

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="phases-title">
      <div className="step-heading">
        <span className="eyebrow">Prvo, zajednički pravac</span>
        <h1 id="phases-title">Za koji period birate dom?</h1>
        <p>Izaberi period koji vam je sada najvažniji. Možete ga promeniti u bilo kom trenutku.</p>
      </div>
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

        <div className="phase-summary" aria-live="polite">
          <span className="phase-summary-icon" aria-hidden="true">{phase.icon}</span>
          <div>
            <span>Planiramo za period</span>
            <h2>{phase.title} · {phase.years}</h2>
            <p>{phase.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
