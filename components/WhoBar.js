'use client';

import { PEOPLE } from '@/lib/data';

export default function WhoBar({ who, onSetWho }) {
  return (
    <div className={`who-bar${who ? '' : ' unset'}`}>
      <span className="who-label">Popunjavam kao:</span>
      {PEOPLE.map(p => (
        <button
          key={p.who}
          className={`who-btn${who === p.who ? ` w${p.cls}` : ''}`}
          onClick={() => onSetWho(p.who)}
        >
          {p.label}
        </button>
      ))}
      <span className="who-hint">
        {who
          ? 'Menjaš samo svoju kolonu — tuđe ocene su zaključane.'
          : 'Izaberi ko si — dok ne izabereš, ocenjivanje je zaključano.'}
      </span>
    </div>
  );
}
