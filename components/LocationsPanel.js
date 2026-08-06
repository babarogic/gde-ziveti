'use client';

import { LOCATIONS, PRIORITIES, PEOPLE } from '@/lib/data';
import { fitFor, weightedScore, dealbreakerCheck } from '@/lib/scoring';

export default function LocationsPanel({
  who, activeLoc, goranRating, partnerRating, goranPrio, partnerPrio,
  goranDB, partnerDB, fit, dbStatus,
  onSetLoc, onSetRating, onSetFit, isActive,
}) {
  const ratings = { goran: goranRating, partner: partnerRating };
  const prios = { goran: goranPrio || {}, partner: partnerPrio || {} };

  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Ocenite svaku lokaciju od 1 do 5</div>
      <div className="loc-tabs">
        {LOCATIONS.map(loc => {
          const { disqualified } = dealbreakerCheck(loc.id, goranDB, partnerDB, dbStatus);
          return (
            <button
              key={loc.id}
              className={`ltab${loc.id === activeLoc ? ' active' : ''}${disqualified ? ' dq' : ''}`}
              onClick={() => onSetLoc(loc.id)}
            >
              {loc.name.split('—')[0].trim()}
              {disqualified && <span className="dq-mark">✗</span>}
            </button>
          );
        })}
      </div>

      {LOCATIONS.map(loc => {
        const { failed, open, disqualified } = dealbreakerCheck(loc.id, goranDB, partnerDB, dbStatus);

        return (
          <div key={loc.id} className={`loc-card${loc.id === activeLoc ? ' active' : ''}`}>
            <h3>{loc.name}</h3>
            <div className="loc-tagline">{loc.tagline}</div>

            {disqualified && (
              <div className="dq-banner">
                <strong>Pada na uslovima</strong>
                <ul>
                  {failed.map(f => (
                    <li key={f.item}>{f.item} <em>({f.wanted})</em></li>
                  ))}
                </ul>
              </div>
            )}
            {!disqualified && open.length > 0 && (
              <div className="open-banner">
                Nepoznato ({open.length}): {open.map(o => o.item).join(' · ')}
              </div>
            )}

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

            <div className="fit-block">
              <h4>Koliko ovo mesto daje ono što nam je važno</h4>
              <p className="phelp">
                Ovo nije „koliko mi je važno” nego „koliko ovo mesto to ispunjava”.
                Zajedničko je za oboje i množi se sa vašim prioritetima. Polazne
                vrednosti su procene — ispravite ih kad saznate tačno.
              </p>
              {PRIORITIES.map(p => {
                const val = fitFor(fit, loc.id, p);
                return (
                  <div key={p} className="p-item">
                    <span className="pl">{p}</span>
                    <div className="pdots">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div
                          key={n}
                          className={`pdot${n <= val ? ' on fitc' : ''}`}
                          onClick={() => onSetFit(p, loc.id, n)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rating-block">
              <h4>Moja ocena — iz stomaka (1–5)</h4>
              {PEOPLE.map(({ who: w, label, cls }) => {
                const val = ratings[w][loc.id] || 0;
                const calc = weightedScore(prios[w], fit, loc.id);
                const mine = who === w;
                return (
                  <div key={w} className={`rrow${mine ? '' : ' locked'}`}>
                    <span className="rn">{label}{mine ? '' : ' 🔒'}</span>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div
                          key={n}
                          className={`star${n <= val ? ` on ${cls}s` : ''}`}
                          onClick={mine ? () => onSetRating(w, loc.id, n === val ? 0 : n) : undefined}
                        >
                          ●
                        </div>
                      ))}
                    </div>
                    <span className="rcalc">
                      matrica: <strong>{calc ? calc.toFixed(1) : '—'}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
