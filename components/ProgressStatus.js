'use client';

import { coupleProgress } from '@/lib/progress';

export default function ProgressStatus(props) {
  const progress = coupleProgress(props);

  return (
    <section className="progress-card" aria-labelledby="progress-title">
      <div>
        <h2 id="progress-title">Spremnost za rezultat</h2>
        <p>Prioriteti i ocene svih lokacija</p>
      </div>
      <div className="progress-people">
        {[
          ['Goran', progress.goran, 'g'],
          ['Supruga', progress.partner, 'p'],
        ].map(([label, value, cls]) => (
          <div className="progress-person" key={label}>
            <div className="progress-label">
              <span>{label}</span>
              <strong>{value.percent}%</strong>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label={`${label}: završeno ${value.percent}%`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={value.percent}
            >
              <span className={`progress-fill ${cls}`} style={{ width: `${value.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
