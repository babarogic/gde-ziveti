'use client';

const TABS = [
  { id: 'phases',      num: '01', label: 'Faze života' },
  { id: 'priorities',  num: '02', label: 'Prioriteti' },
  { id: 'locations',   num: '03', label: 'Lokacije' },
  { id: 'dealbreakers',num: '04', label: 'Dealbreakers' },
  { id: 'summary',     num: '05', label: 'Rezultati' },
];

export default function NavTabs({ activePanel, onSwitch }) {
  return (
    <nav className="main-nav">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`nav-btn${activePanel === tab.id ? ' active' : ''}`}
          onClick={() => onSwitch(tab.id)}
        >
          <span className="num">{tab.num}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
