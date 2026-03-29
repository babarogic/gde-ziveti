'use client';

export default function WhoBar({ who, onSetWho }) {
  return (
    <div className="who-bar">
      <span>Popunjavam kao:</span>
      <button
        className={`who-btn${who === 'goran' ? ' wg' : ''}`}
        onClick={() => onSetWho('goran')}
      >
        Goran
      </button>
      <button
        className={`who-btn${who === 'partner' ? ' wp' : ''}`}
        onClick={() => onSetWho('partner')}
      >
        Supruga
      </button>
    </div>
  );
}
