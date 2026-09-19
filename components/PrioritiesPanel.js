'use client';

import { PRIORITIES, DEALBREAKERS } from '@/lib/data';

export default function PrioritiesPanel({
  who, personName, goranPrio, partnerPrio, goranDB, partnerDB,
  onSetPrio, onSetDB, isActive,
}) {
  const prio = who === 'goran' ? goranPrio : partnerPrio;
  const dealbreakers = who === 'goran' ? goranDB : partnerDB;
  const selectedCount = PRIORITIES.filter(item => (prio[item] || 0) > 0).length;
  const requiredCount = DEALBREAKERS.filter(item => dealbreakers[item]).length;
  const atLimit = selectedCount >= 5;
  const dbAtLimit = requiredCount >= 3;

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="priorities-title">
      <div className="step-heading">
        <span className="eyebrow">Samo tvoji odgovori</span>
        <h1 id="priorities-title">{personName}, šta ti je najvažnije?</h1>
        <p>Izaberi do pet stvari. Označi šta je važno, a šta je presudno.</p>
      </div>
      <div className="selection-counter"><strong>{selectedCount}</strong> / 5 izabrano</div>
      <div className="priority-list">
        {PRIORITIES.map(item => {
          const value = prio[item] || 0;
          const isSelected = value > 0;
          return (
            <div key={item} className={`priority-item${isSelected ? ' selected' : ''}`}>
              <span>{item}</span>
              <div className="choice-pills">
                <button type="button" className={value > 0 && value < 4 ? 'active' : ''}
                  onClick={() => onSetPrio(who, item, value > 0 && value < 4 ? 0 : 3)}
                  disabled={!isSelected && atLimit}>Važno</button>
                <button type="button" className={value >= 4 ? 'active strong' : ''}
                  onClick={() => onSetPrio(who, item, value >= 4 ? 0 : 5)}
                  disabled={!isSelected && atLimit}>Presudno</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="must-have-section">
        <div className="section-intro">
          <span className="eyebrow">Opcionalno</span>
          <h2>Bez čega ne možeš?</h2>
          <p>Izaberi najviše tri uslova koji zaista mogu da isključe neko mesto.</p>
        </div>
        <div className="must-have-grid">
          {DEALBREAKERS.map(item => (
            <label key={item} className={dealbreakers[item] ? 'checked' : ''}>
              <input type="checkbox" checked={!!dealbreakers[item]}
                disabled={!dealbreakers[item] && dbAtLimit}
                onChange={event => onSetDB(who, item, event.target.checked)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <div className="selection-foot">{requiredCount} / 3 obavezna uslova</div>
      </div>
    </section>
  );
}
