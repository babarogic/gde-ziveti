'use client';

import { DEALBREAKERS, LOCATIONS, PEOPLE } from '@/lib/data';
import { dbStatusFor } from '@/lib/scoring';

const CYCLE = { yes: 'no', no: 'unknown', unknown: 'yes' };
const MARK = { yes: '✓', no: '✗', unknown: '?' };
const TITLE = { yes: 'Ispunjava', no: 'Ne ispunjava', unknown: 'Ne znamo — treba proveriti' };

export default function DealbreakersPanel({
  who, goranDB, partnerDB, dbStatus, onSetDB, onSetDBStatus, isActive,
}) {
  const dbs = { goran: goranDB, partner: partnerDB };
  const required = DEALBREAKERS.filter(item => goranDB[item] || partnerDB[item]);

  return (
    <div className={`panel${isActive ? ' active' : ''}`}>
      <div className="slabel">Apsolutni uslovi — bez ovoga ne može</div>
      <p className="phelp">
        Uslov koji bar jedno od vas čekira postaje obavezan. Lokacija koja ga
        ne ispunjava se diskvalifikuje — bez obzira na ocene.
      </p>

      <div className="db-grid">
        {PEOPLE.map(({ who: w, label, cls }) => {
          const db = dbs[w];
          const mine = who === w;
          return (
            <div key={w} className={`db-col d${cls}${mine ? '' : ' locked'}`}>
              <h3>
                {label}
                {mine ? <span className="col-tag">ti</span> : <span className="col-tag lock">🔒</span>}
              </h3>
              {DEALBREAKERS.map(item => (
                <label key={item} className="db-item">
                  <input
                    type="checkbox"
                    checked={!!db[item]}
                    disabled={!mine}
                    onChange={e => onSetDB(w, item, e.target.checked)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          );
        })}
      </div>

      <div className="slabel">Da li lokacija ispunjava uslov?</div>
      {required.length === 0 ? (
        <div className="empty-note">
          Čim čekirate neki uslov gore, ovde se pojavljuje tabela za proveru po lokacijama.
        </div>
      ) : (
        <div className="dbm-wrap">
          <table className="dbm">
            <thead>
              <tr>
                <th className="dbm-head">Uslov</th>
                {LOCATIONS.map(loc => (
                  <th key={loc.id}>{loc.name.split('—')[0].trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {required.map(item => (
                <tr key={item}>
                  <td className="dbm-head">
                    {item}
                    <span className="dbm-who">
                      {goranDB[item] && partnerDB[item] ? 'oboje' : goranDB[item] ? 'Goran' : 'Supruga'}
                    </span>
                  </td>
                  {LOCATIONS.map(loc => {
                    const st = dbStatusFor(dbStatus, loc.id, item);
                    return (
                      <td key={loc.id}>
                        <button
                          className={`dbm-cell ${st}`}
                          title={TITLE[st]}
                          onClick={() => onSetDBStatus(loc.id, item, CYCLE[st])}
                        >
                          {MARK[st]}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dbm-legend">
            <span><b className="yes">✓</b> ispunjava</span>
            <span><b className="no">✗</b> ne ispunjava — diskvalifikuje</span>
            <span><b className="unknown">?</b> ne znamo — ide na listu za proveru</span>
            <span className="dbm-hint">klik menja stanje</span>
          </div>
        </div>
      )}
    </div>
  );
}
