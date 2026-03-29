'use client';

import { LOCATIONS } from '@/lib/data';

export default function LocationsPanel({ activeLoc, goranRating, partnerRating, onSetLoc, onSetRating, isActive }) {
  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Ocenite svaku lokaciju od 1 do 5</div>
      <div className="loc-tabs">
        {LOCATIONS.map(loc => (
          <button
            key={loc.id}
            className={`ltab${loc.id === activeLoc ? ' active' : ''}`}
            onClick={() => onSetLoc(loc.id)}
          >
            {loc.name.split('—')[0].trim()}
          </button>
        ))}
      </div>
      {LOCATIONS.map(loc => {
        const gr = goranRating[loc.id] || 0;
        const pr = partnerRating[loc.id] || 0;
        return (
          <div key={loc.id} className={`loc-card${loc.id === activeLoc ? ' active' : ''}`}>
            <h3>{loc.name}</h3>
            <div className="loc-tagline">{loc.tagline}</div>
            <div className="pc-grid">
              <div className="pc-group pros">
                <h4>Plusevi</h4>
                <ul>{loc.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
              <div className="pc-group cons">
                <h4>Minusi</h4>
                <ul>{loc.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </div>
            </div>
            <div className="rating-block">
              <h4>Moja ocena (1–5)</h4>
              {[
                { who: 'goran', val: gr, cls: 'gs', label: 'Goran' },
                { who: 'partner', val: pr, cls: 'ps', label: 'Supruga' },
              ].map(({ who, val, cls, label }) => (
                <div key={who} className="rrow">
                  <span className="rn">{label}</span>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div
                        key={n}
                        className={`star${n <= val ? ` on ${cls}` : ''}`}
                        onClick={() => onSetRating(who, loc.id, n)}
                      >
                        ●
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
