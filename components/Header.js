'use client';

export default function Header({ personName, onChangePerson }) {
  return (
    <header className="app-header">
      <a className="brand" href="#main-content" aria-label="Gde ćemo živeti — početak">
        <span className="brand-mark" aria-hidden="true">⌂</span>
        <span>Gde ćemo <em>živeti?</em></span>
      </a>
      <div className="person-menu">
        <span>Popunjavaš kao <strong>{personName}</strong></span>
        <button type="button" onClick={onChangePerson}>Promeni</button>
      </div>
    </header>
  );
}
