'use client';

import { useState } from 'react';

export default function WelcomeScreen({ partnerName, onChoose, onSavePartnerName }) {
  const [name, setName] = useState(partnerName || '');

  function continueAsPartner(event) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    onSavePartnerName(cleanName);
    onChoose('partner');
  }

  return (
    <div className="welcome-shell">
      <div className="welcome-art" aria-hidden="true">
        <span className="sun" />
        <span className="house">⌂</span>
        <span className="path" />
      </div>
      <section className="welcome-card" aria-labelledby="welcome-title">
        <span className="eyebrow">Odluka koju donosite zajedno</span>
        <h1 id="welcome-title">Hajde da izaberemo gde ćete <em>živeti.</em></h1>
        <p className="welcome-copy">Svako prvo odgovara za sebe. Zatim zajedno gledate gde se slažete, šta treba proveriti i koji je sledeći korak.</p>
        <div className="identity-choice">
          <span>Ko danas popunjava?</span>
          <button type="button" className="identity-card goran" onClick={() => onChoose('goran')}>
            <span className="avatar">G</span>
            <span><strong>Nastavi kao Goran</strong><small>Moji odgovori su odvojeni</small></span>
            <b aria-hidden="true">→</b>
          </button>
          <form className="identity-card partner" onSubmit={continueAsPartner}>
            <span className="avatar">{name.trim().charAt(0).toUpperCase() || '•'}</span>
            <label>
              <span>Druga osoba</span>
              <input value={name} onChange={event => setName(event.target.value)}
                placeholder="Upiši svoje ime" aria-label="Tvoje ime" />
            </label>
            <button type="submit" disabled={!name.trim()} aria-label="Nastavi kao druga osoba">→</button>
          </form>
        </div>
        <p className="welcome-note">Potrebno je oko 5 minuta po osobi. Odgovori se čuvaju automatski.</p>
      </section>
    </div>
  );
}
