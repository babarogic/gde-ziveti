'use client';

import { DEALBREAKERS } from '@/lib/data';

export default function DealbreakersPanel({ goranDB, partnerDB, onSetDB, isActive }) {
  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Apsolutni uslovi — bez ovoga ne može</div>
      <div className="db-grid">
        {[
          { who: 'goran', db: goranDB, cls: 'dg', label: 'Goran' },
          { who: 'partner', db: partnerDB, cls: 'dp', label: 'Supruga' },
        ].map(({ who, db, cls, label }) => (
          <div key={who} className={`db-col ${cls}`}>
            <h3>{label}</h3>
            {DEALBREAKERS.map(item => (
              <div key={item} className="db-item">
                <input
                  type="checkbox"
                  checked={!!db[item]}
                  onChange={e => onSetDB(who, item, e.target.checked)}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
