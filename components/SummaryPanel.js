'use client';

import { LOCATIONS, PRIORITIES } from '@/lib/data';
import { rankLocations, drivers } from '@/lib/scoring';
import { coupleProgress } from '@/lib/progress';

const shortName = name => name.split('—')[0].trim();

export default function SummaryPanel({
  goranRating, partnerRating, goranPrio, partnerPrio, goranDB, partnerDB,
  fit, dbStatus, activePhase, isActive, peopleNames,
}) {
  const ranked = rankLocations({ goranPrio, partnerPrio, goranRating, partnerRating, goranDB, partnerDB, fit, dbStatus, activePhase });
  const progress = coupleProgress({ goranPrio, partnerPrio, goranRating, partnerRating });
  const hasAnyAnswer = ranked.some(item => item.calcAvg || item.gutAvg);
  const winner = ranked.find(item => !item.disqualified && (item.calcAvg || item.gutAvg));
  const winnerDrivers = winner ? { g: drivers(goranPrio, fit, winner.loc.id), p: drivers(partnerPrio, fit, winner.loc.id) } : null;
  const names = { goran: peopleNames.goran || 'Goran', partner: peopleNames.partner || 'Druga osoba' };

  const tensions = [];
  LOCATIONS.forEach(loc => {
    const g = goranRating[loc.id] || 0;
    const p = partnerRating[loc.id] || 0;
    if (g && p && Math.abs(g - p) >= 2) tensions.push({ label: shortName(loc.name), g, p, diff: Math.abs(g - p) });
  });
  PRIORITIES.forEach(item => {
    const g = goranPrio[item] || 0;
    const p = partnerPrio[item] || 0;
    if (g && p && Math.abs(g - p) >= 2) tensions.push({ label: item, g, p, diff: Math.abs(g - p) });
  });
  tensions.sort((a, b) => b.diff - a.diff);

  return (
    <section className={`panel${isActive ? ' active' : ''}`} aria-labelledby="summary-title">
      <div className="step-heading split-heading">
        <div><span className="eyebrow">Sada gledate zajedno</span><h1 id="summary-title">Gde se vaši odgovori susreću?</h1><p>Rezultat nije presuda. On pokazuje najbolje teme za razgovor.</p></div>
        <div className={`confidence ${progress.ready ? 'ready' : ''}`}><span>{progress.ready ? 'Spremno' : 'Rani pregled'}</span><strong>{Math.round((progress.goran.percent + progress.partner.percent) / 2)}%</strong></div>
      </div>

      {!progress.ready && <div className="readiness-banner"><strong>Rezultat se još menja</strong><span>{names.goran} {progress.goran.percent}% · {names.partner} {progress.partner.percent}%. Možete razgovarati već sada, a redosled će postajati precizniji.</span></div>}

      {!hasAnyAnswer ? <div className="empty-state"><span>◎</span><h2>Još nema dovoljno odgovora</h2><p>Svako neka izabere prioritete i oceni mesta. Ovde će se pojaviti zajedničko poređenje.</p></div> : (
        <div className="ranking-list">
          {ranked.map((item, index) => {
            const score = item.calcAvg || item.gutAvg;
            return <article key={item.loc.id} className={`rank-card${item.disqualified ? ' disqualified' : ''}`}>
              <div className="rank-number">{item.disqualified ? '×' : String(index + 1).padStart(2, '0')}</div>
              <div className="rank-main"><div className="rank-title"><h2>{shortName(item.loc.name)}</h2>{winner?.loc.id === item.loc.id && <span>Najbolje se uklapa</span>}{item.disqualified && <span className="danger">Pada na uslovima</span>}</div>
                <div className="couple-bars">
                  <div><span>{names.goran}</span><i><b style={{ width: `${item.gCalc * 20}%` }} /></i><strong>{item.gCalc ? item.gCalc.toFixed(1) : '—'}</strong></div>
                  <div><span>{names.partner}</span><i><b style={{ width: `${item.pCalc * 20}%` }} /></i><strong>{item.pCalc ? item.pCalc.toFixed(1) : '—'}</strong></div>
                </div>
              </div><div className="rank-score"><strong>{score ? score.toFixed(1) : '—'}</strong><span>/ 5</span></div>
            </article>;
          })}
        </div>
      )}

      {winner && winnerDrivers && <div className="conversation-grid">
        <article className="conversation-card highlight"><span className="eyebrow">Zašto vodi</span><h2>{shortName(winner.loc.name)}</h2><div className="driver-columns">
          {[['g', names.goran], ['p', names.partner]].map(([key, label]) => <div key={key}><h3>{label}</h3>{winnerDrivers[key].plus.slice(0,2).map(item => <p key={item.prio}>+ {item.prio}</p>)}{winnerDrivers[key].minus.slice(0,1).map(item => <p className="minus" key={item.prio}>− {item.prio}</p>)}</div>)}
        </div></article>
        <article className="conversation-card"><span className="eyebrow">Pričajte o ovome</span><h2>Najveće razlike</h2>{tensions.length ? tensions.slice(0,4).map(item => <div className="difference-row" key={item.label}><span>{item.label}</span><b>{item.g} : {item.p}</b></div>) : <p className="calm-note">Za sada nema velikih razlika. Možda ste veoma usklađeni — ili tek treba da završite odgovore.</p>}</article>
      </div>}
    </section>
  );
}
