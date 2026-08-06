'use client';

import { useReducer, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import NavTabs from '@/components/NavTabs';
import WhoBar from '@/components/WhoBar';
import PhasesPanel from '@/components/PhasesPanel';
import PrioritiesPanel from '@/components/PrioritiesPanel';
import LocationsPanel from '@/components/LocationsPanel';
import DealbreakersPanel from '@/components/DealbreakersPanel';
import SummaryPanel from '@/components/SummaryPanel';
import SyncStatusBar from '@/components/SyncStatusBar';

const WHO_KEY = 'gz-who';

// Polja koja se čuvaju u bazi. Šalju se samo ona koja su stvarno menjana
// u ovoj sesiji — zato dvoje mogu da popunjavaju istovremeno bez brisanja.
const PERSISTED = [
  'goranPrio', 'partnerPrio',
  'goranRating', 'partnerRating',
  'goranDB', 'partnerDB',
  'fit', 'dbStatus', 'notes',
];

const initialState = {
  goranPrio: {},
  partnerPrio: {},
  goranRating: {},
  partnerRating: {},
  goranDB: {},
  partnerDB: {},
  fit: {},
  dbStatus: {},
  notes: '',
  activePhase: 'now',
  activeLoc: 'grad',
  activePanel: 'phases',
  who: null,
  syncStatus: 'loading',
  syncMessage: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PRIO':
      return {
        ...state,
        [`${action.who}Prio`]: { ...state[`${action.who}Prio`], [action.name]: action.val },
      };
    case 'SET_RATING':
      return {
        ...state,
        [`${action.who}Rating`]: { ...state[`${action.who}Rating`], [action.locId]: action.val },
      };
    case 'SET_DB':
      return {
        ...state,
        [`${action.who}DB`]: { ...state[`${action.who}DB`], [action.item]: action.checked },
      };
    case 'SET_FIT':
      return {
        ...state,
        fit: { ...state.fit, [action.prio]: { ...state.fit[action.prio], [action.locId]: action.val } },
      };
    case 'SET_DB_STATUS':
      return {
        ...state,
        dbStatus: { ...state.dbStatus, [action.locId]: { ...state.dbStatus[action.locId], [action.item]: action.val } },
      };
    case 'SET_PHASE':
      return { ...state, activePhase: action.id };
    case 'SET_LOC':
      return { ...state, activeLoc: action.id };
    case 'SET_PANEL':
      return { ...state, activePanel: action.id };
    case 'SET_WHO':
      return { ...state, who: action.who };
    case 'SET_NOTES':
      return { ...state, notes: action.notes };
    case 'SET_SYNC':
      return { ...state, syncStatus: action.status, syncMessage: action.message || '' };
    case 'LOAD_DATA':
      return { ...state, ...action.data, syncStatus: 'saved', syncMessage: 'Učitano ✓' };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimerRef = useRef(null);
  const stateRef = useRef(state);
  const dirtyRef = useRef(new Set());
  stateRef.current = state;

  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_SYNC', status: 'loading', message: 'Učitavam...' });
    try {
      const { data, error } = await supabase
        .from('framework_data')
        .select('data')
        .eq('id', 'shared')
        .maybeSingle();
      if (error) throw error;

      const d = data?.data || {};
      const loaded = {};
      for (const k of PERSISTED) {
        // ono što je izmenjeno a još nije sačuvano ne gazimo podacima iz baze
        if (dirtyRef.current.has(k)) continue;
        loaded[k] = d[k] ?? initialState[k];
      }
      dispatch({ type: 'LOAD_DATA', data: loaded });
    } catch (e) {
      dispatch({ type: 'SET_SYNC', status: 'error', message: 'Greška pri učitavanju' });
      console.error(e);
    }
  }, []);

  const saveData = useCallback(async () => {
    const keys = [...dirtyRef.current];
    if (!keys.length) return;
    dirtyRef.current = new Set();

    dispatch({ type: 'SET_SYNC', status: 'saving', message: 'Čuvam...' });
    const s = stateRef.current;
    try {
      const { data: latestRow, error: readErr } = await supabase
        .from('framework_data')
        .select('data')
        .eq('id', 'shared')
        .maybeSingle();
      if (readErr) throw readErr;

      // Krećemo od najsvežijeg stanja u bazi i upisujemo SAMO svoje izmene.
      const payload = { ...(latestRow?.data || {}) };
      for (const k of keys) payload[k] = s[k];

      const { error } = await supabase
        .from('framework_data')
        .upsert({ id: 'shared', data: payload, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (error) throw error;

      dispatch({ type: 'SET_SYNC', status: 'saved', message: 'Sačuvano ✓' });
    } catch (e) {
      keys.forEach(k => dirtyRef.current.add(k)); // izmene se ne gube, probaće opet
      dispatch({ type: 'SET_SYNC', status: 'error', message: 'Greška pri čuvanju' });
      console.error(e);
    }
  }, []);

  const schedSave = useCallback((...keys) => {
    keys.forEach(k => dirtyRef.current.add(k));
    clearTimeout(saveTimerRef.current);
    dispatch({ type: 'SET_SYNC', status: 'waiting', message: 'Čeka...' });
    saveTimerRef.current = setTimeout(saveData, 1200);
  }, [saveData]);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(WHO_KEY) : null;
    if (stored === 'goran' || stored === 'partner') dispatch({ type: 'SET_WHO', who: stored });
    loadData();
    return () => clearTimeout(saveTimerRef.current);
  }, [loadData]);

  // Tuđe izmene stižu uživo — bez ovoga jedno ne vidi šta drugo radi.
  useEffect(() => {
    const channel = supabase
      .channel('framework_data-shared')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'framework_data', filter: 'id=eq.shared' },
        () => loadData()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadData]);

  const handleSetWho = useCallback((who) => {
    dispatch({ type: 'SET_WHO', who });
    try { window.localStorage.setItem(WHO_KEY, who); } catch {}
  }, []);

  const handleSetPrio = useCallback((who, name, val) => {
    dispatch({ type: 'SET_PRIO', who, name, val });
    schedSave(`${who}Prio`);
  }, [schedSave]);

  const handleSetRating = useCallback((who, locId, val) => {
    dispatch({ type: 'SET_RATING', who, locId, val });
    schedSave(`${who}Rating`);
  }, [schedSave]);

  const handleSetDB = useCallback((who, item, checked) => {
    dispatch({ type: 'SET_DB', who, item, checked });
    schedSave(`${who}DB`);
  }, [schedSave]);

  const handleSetFit = useCallback((prio, locId, val) => {
    dispatch({ type: 'SET_FIT', prio, locId, val });
    schedSave('fit');
  }, [schedSave]);

  const handleSetDBStatus = useCallback((locId, item, val) => {
    dispatch({ type: 'SET_DB_STATUS', locId, item, val });
    schedSave('dbStatus');
  }, [schedSave]);

  const handleNotesChange = useCallback((notes) => {
    dispatch({ type: 'SET_NOTES', notes });
    schedSave('notes');
  }, [schedSave]);

  return (
    <>
      <Header />
      <WhoBar who={state.who} onSetWho={handleSetWho} />
      <NavTabs
        activePanel={state.activePanel}
        onSwitch={id => dispatch({ type: 'SET_PANEL', id })}
      />
      <PhasesPanel
        isActive={state.activePanel === 'phases'}
        activePhase={state.activePhase}
        onSetPhase={id => dispatch({ type: 'SET_PHASE', id })}
      />
      <PrioritiesPanel
        isActive={state.activePanel === 'priorities'}
        who={state.who}
        goranPrio={state.goranPrio}
        partnerPrio={state.partnerPrio}
        onSetPrio={handleSetPrio}
      />
      <LocationsPanel
        isActive={state.activePanel === 'locations'}
        who={state.who}
        activeLoc={state.activeLoc}
        goranRating={state.goranRating}
        partnerRating={state.partnerRating}
        goranPrio={state.goranPrio}
        partnerPrio={state.partnerPrio}
        goranDB={state.goranDB}
        partnerDB={state.partnerDB}
        fit={state.fit}
        dbStatus={state.dbStatus}
        onSetLoc={id => dispatch({ type: 'SET_LOC', id })}
        onSetRating={handleSetRating}
        onSetFit={handleSetFit}
      />
      <DealbreakersPanel
        isActive={state.activePanel === 'dealbreakers'}
        who={state.who}
        goranDB={state.goranDB}
        partnerDB={state.partnerDB}
        dbStatus={state.dbStatus}
        onSetDB={handleSetDB}
        onSetDBStatus={handleSetDBStatus}
      />
      <SummaryPanel
        isActive={state.activePanel === 'summary'}
        goranRating={state.goranRating}
        partnerRating={state.partnerRating}
        goranPrio={state.goranPrio}
        partnerPrio={state.partnerPrio}
        goranDB={state.goranDB}
        partnerDB={state.partnerDB}
        fit={state.fit}
        dbStatus={state.dbStatus}
        notes={state.notes}
        onNotesChange={handleNotesChange}
        onRefresh={loadData}
      />
      <SyncStatusBar status={state.syncStatus} message={state.syncMessage} />
    </>
  );
}
