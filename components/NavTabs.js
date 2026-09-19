'use client';

const TABS = [
  { id: 'plan',       label: 'Naš plan' },
  { id: 'priorities', label: 'Šta mi je važno' },
  { id: 'locations',  label: 'Mesta' },
  { id: 'compare',    label: 'Poređenje' },
  { id: 'decision',   label: 'Dogovor' },
];

export default function NavTabs({ activePanel, onSwitch }) {
  const activeIndex = TABS.findIndex(tab => tab.id === activePanel);
  return (
    <nav className="journey-nav" aria-label="Koraci odluke">
      <div className="journey-current">
        <span>Korak {activeIndex + 1} od {TABS.length}</span>
        <strong>{TABS[activeIndex]?.label}</strong>
      </div>
      <ol>
      {TABS.map((tab, index) => (
        <li key={tab.id}>
        <button
          type="button"
          className={`nav-btn${activePanel === tab.id ? ' active' : ''}${index < activeIndex ? ' visited' : ''}`}
          onClick={() => onSwitch(tab.id)}
          aria-current={activePanel === tab.id ? 'step' : undefined}
        >
          <span className="num">{String(index + 1).padStart(2, '0')}</span>
          <span>{tab.label}</span>
        </button>
        </li>
      ))}
      </ol>
    </nav>
  );
}
