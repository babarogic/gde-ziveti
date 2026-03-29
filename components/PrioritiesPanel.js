'use client';

import { PRIORITIES } from '@/lib/data';

export default function PrioritiesPanel({ goranPrio, partnerPrio, onSetPrio, isActive }) {
  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Ocenite šta vam je važno — 1 do 5 tačkica, odvojeno</div>
      <div className="priorities-grid">
        {[
          { who: 'goran', prio: goranPrio, cls: 'gc', label: 'Goran' },
          { who: 'partner', prio: partnerPrio, cls: 'pc', label: 'Supruga' },
        ].map(({ who, prio, cls, label }) => (
          <div key={who} className={`p-col ${cls}`}>
            <h3>{label}</h3>
            {PRIORITIES.map(p => {
              const val = prio[p] || 0;
              return (
                <div key={p} className="p-item">
                  <span className="pl">{p}</span>
                  <div className="pdots">
                    {[1, 2, 3, 4, 5].map(n => (
                      <div
                        key={n}
                        className={`pdot${n <= val ? ` on ${cls}` : ''}`}
                        onClick={() => onSetPrio(who, p, n)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
