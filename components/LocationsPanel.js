'use client';

import { LOCATIONS, PRIORITIES } from '@/lib/data';
import { fitFor, weightedScore, dealbreakerCheck } from '@/lib/scoring';

export default function LocationsPanel({
  who, personName, activeLoc, goranRating, partnerRating, goranPrio, partnerPrio,
  goranDB, partnerDB, fit, dbStatus, onSetLoc, onSetRating, onSetFit, isActive,
}) {
  const ratings = who === 'goran' ? goranRating : partnerRating;
  const priorities = who === 'goran' ? goranPrio : partnerPrio;
  const ratedCount = LOCATIONS.filter(loc => (ratings[loc.id] || 0) > 0).length;
  const loc = LOCATIONS.find(item => item.id === activeLoc) || LOCATIONS[0];
  const currentIndex = LOCATIONS.findIndex(item => item.id === loc.id);
  const value = ratings[loc.id] || 0;
  const calc = weightedScore(priorities, fit, loc.id);
  const { failed, open, disqualified } = dealbreakerCheck(loc.id, goranDB, partnerDB, dbStatus);

  function move(offset) {
    const next = LOCATIONS[(currentIndex + offset + LOCATIONS.length) % LOCATIONS.length];
    onSetLoc(next.id);
  }

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="locations-title">
      <div className="step-heading split-heading">
        <div>
          <span className="eyebrow">Brza lična reakcija</span>
          <h1 id="locations-title">{personName}, kako ti deluju ova mesta?</h1>
          <p>Oceni osećaj. Detaljnu računicu možeš pogledati, ali ne moraš da je menjaš.</p>
        </div>
        <div className="location-progress"><strong>{ratedCount}</strong> / {LOCATIONS.length}<span>ocenjeno</span></div>
      </div>

      <div className="loc-tabs" aria-label="Izaberi mesto">
        {LOCATIONS.map(item => (
          <button type="button" key={item.id}
            className={`ltab${item.id === loc.id ? ' active' : ''}${ratings[item.id] ? ' done' : ''}`}
            onClick={() => onSetLoc(item.id)}>
            <span>{item.name.split('—')[0].trim()}</span>
            {ratings[item.id] ? <b aria-label="ocenjeno">✓</b> : null}
          </button>
        ))}
      </div>

      <article className="location-focus">
        <div className="location-title">
          <span>{String(currentIndex + 1).padStart(2, '0')}</span>
          <div><h2>{loc.name}</h2><p>{loc.tagline}</p></div>
        </div>

        {disqualified && <div className="dq-banner"><strong>Ne ispunjava obavezan uslov</strong><span>{failed.map(item => item.item).join(' · ')}</span></div>}
        {!disqualified && open.length > 0 && <div className="open-banner">Treba proveriti: {open.map(item => item.item).join(' · ')}</div>}

        <div className="gut-rating">
          <div><span className="eyebrow">Tvoj osećaj</span><h3>Da li možeš da zamisliš život ovde?</h3></div>
          <div className="rating-scale" role="group" aria-label={`Ocena za ${loc.name}`}>
            {[1, 2, 3, 4, 5].map(number => (
              <button type="button" key={number} className={number === value ? 'active' : ''}
                onClick={() => onSetRating(who, loc.id, number === value ? 0 : number)}
                aria-pressed={number === value} aria-label={`${number} od 5`}>
                <b>{number}</b><span>{number === 1 ? 'Ne' : number === 3 ? 'Možda' : number === 5 ? 'Da' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pc-grid">
          <div className="pc-group pros"><h3>Šta ide u prilog</h3><ul>{loc.pros.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div className="pc-group cons"><h3>Šta traži kompromis</h3><ul>{loc.cons.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>

        <details className="advanced-fit">
          <summary><span>Kako je izračunata ocena</span><b>{calc ? calc.toFixed(1) : '—'} / 5</b></summary>
          <p>Ovo su zajedničke polazne procene. Menjajte ih tek kada proverite činjenice.</p>
          {PRIORITIES.map(item => {
            const fitValue = fitFor(fit, loc.id, item);
            return <div className="fit-row" key={item}><span>{item}</span><div>{[1,2,3,4,5].map(number => <button type="button" key={number}
              className={number <= fitValue ? 'on' : ''} onClick={() => onSetFit(item, loc.id, number)}
              aria-label={`${item}: ${number} od 5`} aria-pressed={number === fitValue} />)}</div></div>;
          })}
        </details>

        <div className="location-pager">
          <button type="button" onClick={() => move(-1)}>← Prethodno</button>
          <span>{currentIndex + 1} / {LOCATIONS.length}</span>
          <button type="button" onClick={() => move(1)}>Sledeće →</button>
        </div>
      </article>
    </section>
  );
}
