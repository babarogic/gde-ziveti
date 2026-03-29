'use client';

import { useReducer, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import NavTabs from '@/components/NavTabs';
import PhasesPanel from '@/components/PhasesPanel';
import PrioritiesPanel from '@/components/PrioritiesPanel';
import LocationsPanel from '@/components/LocationsPanel';
import DealbreakersPanel from '@/components/DealbreakersPanel';
import SummaryPanel from '@/components/SummaryPanel';
import SyncStatusBar from '@/components/SyncStatusBar';

const initialState = {
  goranPrio: {},
  partnerPrio: {},
  goranRating: {},
  partnerRating: {},
  goranDB: {},
  partnerDB: {},
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
  stateRef.current = state;

  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_SYNC', status: 'loading', message: 'Učitavam...' });
    try {
      const { data, error } = await supabase
        .from('framework_data')
        .select('data')
        .eq('id', 'shared')
        .single();
      if (error) throw error;
      const d = data.data || {};
      dispatch({
        type: 'LOAD_DATA',
        data: {
          goranPrio:     d.goranPrio     || {},
          partnerPrio:   d.partnerPrio   || {},
          goranRating:   d.goranRating   || {},
          partnerRating: d.partnerRating || {},
          goranDB:       d.goranDB       || {},
          partnerDB:     d.partnerDB     || {},
          notes:         d.notes         || '',
        },
      });
    } catch (e) {
      dispatch({ type: 'SET_SYNC', status: 'error', message: 'Greška pri učitavanju' });
      console.error(e);
    }
  }, []);

  const saveData = useCallback(async () => {
    dispatch({ type: 'SET_SYNC', status: 'saving', message: 'Čuvam...' });
    const s = stateRef.current;
    try {
      const { data: latestDB } = await supabase
        .from('framework_data')
        .select('data')
        .eq('id', 'shared')
        .single();
      const latest = latestDB?.data || {};
      const who = s.who;

      const payload = {
        goranPrio:     who === 'partner' ? (latest.goranPrio     || s.goranPrio)     : s.goranPrio,
        partnerPrio:   who === 'goran'   ? (latest.partnerPrio   || s.partnerPrio)   : s.partnerPrio,
        goranRating:   who === 'partner' ? (latest.goranRating   || s.goranRating)   : s.goranRating,
        partnerRating: who === 'goran'   ? (latest.partnerRating || s.partnerRating) : s.partnerRating,
        goranDB:       who === 'partner' ? (latest.goranDB       || s.goranDB)       : s.goranDB,
        partnerDB:     who === 'goran'   ? (latest.partnerDB     || s.partnerDB)     : s.partnerDB,
        notes:         s.notes,
      };

      const { error } = await supabase
        .from('framework_data')
        .upsert({ id: 'shared', data: payload, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (error) throw error;

      dispatch({ type: 'SET_SYNC', status: 'saved', message: 'Sačuvano ✓' });
    } catch (e) {
      dispatch({ type: 'SET_SYNC', status: 'error', message: 'Greška pri čuvanju' });
      console.error(e);
    }
  }, []);

  const schedSave = useCallback(() => {
    clearTimeout(saveTimerRef.current);
    dispatch({ type: 'SET_SYNC', status: 'waiting', message: 'Čeka...' });
    saveTimerRef.current = setTimeout(saveData, 1200);
  }, [saveData]);

  useEffect(() => {
    loadData();
    return () => clearTimeout(saveTimerRef.current);
  }, [loadData]);

  const handleSetPrio = useCallback((who, name, val) => {
    dispatch({ type: 'SET_PRIO', who, name, val });
    schedSave();
  }, [schedSave]);

  const handleSetRating = useCallback((who, locId, val) => {
    dispatch({ type: 'SET_RATING', who, locId, val });
    schedSave();
  }, [schedSave]);

  const handleSetDB = useCallback((who, item, checked) => {
    dispatch({ type: 'SET_DB', who, item, checked });
    schedSave();
  }, [schedSave]);

  const handleNotesChange = useCallback((notes) => {
    dispatch({ type: 'SET_NOTES', notes });
    schedSave();
  }, [schedSave]);

  return (
    <>
      <Header />
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
        goranPrio={state.goranPrio}
        partnerPrio={state.partnerPrio}
        onSetPrio={handleSetPrio}
      />
      <LocationsPanel
        isActive={state.activePanel === 'locations'}
        activeLoc={state.activeLoc}
        goranRating={state.goranRating}
        partnerRating={state.partnerRating}
        onSetLoc={id => dispatch({ type: 'SET_LOC', id })}
        onSetRating={handleSetRating}
      />
      <DealbreakersPanel
        isActive={state.activePanel === 'dealbreakers'}
        goranDB={state.goranDB}
        partnerDB={state.partnerDB}
        onSetDB={handleSetDB}
      />
      <SummaryPanel
        isActive={state.activePanel === 'summary'}
        goranRating={state.goranRating}
        partnerRating={state.partnerRating}
        goranPrio={state.goranPrio}
        partnerPrio={state.partnerPrio}
        notes={state.notes}
        onNotesChange={handleNotesChange}
        onRefresh={loadData}
      />
      <SyncStatusBar status={state.syncStatus} message={state.syncMessage} />
    </>
  );
}
