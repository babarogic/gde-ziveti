'use client';

import { LOCATIONS, PRIORITIES } from '@/lib/data';

export default function SummaryPanel({ goranRating, partnerRating, goranPrio, partnerPrio, notes, onNotesChange, onRefresh, isActive }) {
  const scores = LOCATIONS.map(loc => ({
    loc,
    g: goranRating[loc.id] || 0,
    p: partnerRating[loc.id] || 0,
    avg: ((goranRating[loc.id] || 0) + (partnerRating[loc.id] || 0)) / 2,
  })).sort((a, b) => b.avg - a.avg);

  const tensions = [];
  LOCATIONS.forEach(loc => {
    const g = goranRating[loc.id] || 0;
    const p = partnerRating[loc.id] || 0;
    const diff = Math.abs(g - p);
    if (g > 0 && p > 0 && diff >= 2) {
      tensions.push({ name: loc.name.split('—')[0].trim(), diff, g, p, cls: diff >= 3 ? 'high' : 'med' });
    }
  });
  PRIORITIES.forEach(pr => {
    const g = goranPrio[pr] || 0;
    const p = partnerPrio[pr] || 0;
    const diff = Math.abs(g - p);
    if (g > 0 && p > 0 && diff >= 2) {
      tensions.push({ name: `Prioritet: ${pr}`, diff, g, p, cls: diff >= 3 ? 'high' : 'med' });
    }
  });

  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Ukupni pregled</div>
      <div className="summary-card">
        <h3>Poređenje lokacija</h3>
        {scores.map((s, i) => (
          <div key={s.loc.id} className="srow">
            <div className="sname">{s.loc.name.split('—')[0].trim()}</div>
            <div className="sbars">
              <div className="strack"><div className="sfill sg" style={{ width: `${s.g * 20}%` }} /></div>
              <div className="strack"><div className="sfill sp" style={{ width: `${s.p * 20}%` }} /></div>
              <div className="bar-labels"><span>G: {s.g || '—'}</span><span>S: {s.p || '—'}</span></div>
            </div>
            <div className="savg">{s.avg > 0 ? s.avg.toFixed(1) : '—'}</div>
            {i === 0 && s.avg > 0 && <span className="stag">Top</span>}
          </div>
        ))}
      </div>

      <div className="tension-card">
        <h4>Tačke razlike — gde razgovor tek počinje</h4>
        {tensions.length > 0 ? tensions.map((t, i) => (
          <div key={i} className="tension-item">
            <div className={`tension-dot ${t.cls}`} />
            <span>{t.name}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '12px' }}>G:{t.g} S:{t.p}</span>
          </div>
        )) : (
          <div className="tension-item">
            <div className="tension-dot low" />
            <span>Nema većih razlika — ili još niste ocenili 😊</span>
          </div>
        )}
      </div>

      <textarea
        className="notes-area"
        value={notes}
        onChange={e => onNotesChange(e.target.value)}
        placeholder="Beleške posle razgovora — šta je ostalo otvoreno, šta ste zaključili..."
      />
      <br />
      <button className="upd-btn" onClick={onRefresh}>↻ Osveži</button>
    </div>
  );
}
