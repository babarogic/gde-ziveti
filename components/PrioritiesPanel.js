'use client';

import { PRIORITIES, PEOPLE } from '@/lib/data';

export default function PrioritiesPanel({ who, goranPrio, partnerPrio, onSetPrio, isActive }) {
  const prios = { goran: goranPrio, partner: partnerPrio };
  const totals = {
    goran: PRIORITIES.reduce((sum, p) => sum + (goranPrio[p] || 0), 0),
    partner: PRIORITIES.reduce((sum, p) => sum + (partnerPrio[p] || 0), 0),
  };

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="priorities-title">
      <h2 className="slabel" id="priorities-title">Ocenite šta vam je važno — od 1 do 5, odvojeno</h2>
      <p className="phelp">
        Ove ocene su težine u računici. Ako svemu daš 5, ništa nije prioritet —
        pokušaj da razlikuješ „važno” od „lepo bi bilo”.
      </p>
      <div className="priorities-grid">
        {PEOPLE.map(({ who: w, label, cls }) => {
          const prio = prios[w];
          const mine = who === w;
          return (
            <div key={w} className={`p-col ${cls}c${mine ? '' : ' locked'}`}>
              <h3>
                {label}
                {mine
                  ? <span className="col-tag">ti</span>
                  : <span className="col-tag lock">🔒</span>}
              </h3>
              {PRIORITIES.map(p => {
                const val = prio[p] || 0;
                return (
                  <div key={p} className="p-item">
                    <span className="pl">{p}</span>
                    <div className="pdots">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          type="button"
                          key={n}
                          className={`pdot${n <= val ? ` on ${cls}c` : ''}`}
                          onClick={mine ? () => onSetPrio(w, p, n === val ? 0 : n) : undefined}
                          aria-label={`${p}: ${n} od 5${n === val ? ', izabrano' : ''}`}
                          aria-pressed={n === val}
                          disabled={!mine}
                          title={mine ? 'Izaberite ponovo da poništite' : `Ovo popunjava ${label}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="p-total">
                Ukupno poena: <strong>{totals[w]}</strong> / {PRIORITIES.length * 5}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
