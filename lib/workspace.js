import { supabase } from './supabase';

export const PRIVATE_WORKSPACES_ENABLED =
  process.env.NEXT_PUBLIC_PRIVATE_WORKSPACES === 'true';

const ACTIVE_WORKSPACE_KEY = 'gz-active-workspace';

export function dataSource(workspaceId) {
  if (PRIVATE_WORKSPACES_ENABLED) {
    return {
      table: 'couple_data',
      key: 'workspace_id',
      id: workspaceId,
    };
  }

  return {
    table: 'framework_data',
    key: 'id',
    id: 'shared',
  };
}

export async function resolveWorkspace() {
  if (!PRIVATE_WORKSPACES_ENABLED) {
    return { id: 'shared', inviteToken: null, isPrivate: false };
  }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) throw authError;
  }

  const params = new URLSearchParams(window.location.search);
  const inviteToken = params.get('invite');

  if (inviteToken) {
    const { data, error } = await supabase.rpc('join_couple_workspace', {
      provided_invite_token: inviteToken,
    });
    if (error) throw error;
    window.history.replaceState({}, '', window.location.pathname);
    return loadWorkspace(data);
  }

  const activeWorkspaceId = window.localStorage.getItem(ACTIVE_WORKSPACE_KEY);
  if (activeWorkspaceId) {
    const { data: activeMembership, error: activeMembershipError } = await supabase
      .from('couple_members')
      .select('workspace_id')
      .eq('workspace_id', activeWorkspaceId)
      .maybeSingle();
    if (activeMembershipError) throw activeMembershipError;
    if (activeMembership?.workspace_id) return loadWorkspace(activeMembership.workspace_id);
  }

  const { data: membership, error: membershipError } = await supabase
    .from('couple_members')
    .select('workspace_id')
    .limit(1)
    .maybeSingle();
  if (membershipError) throw membershipError;

  if (membership?.workspace_id) return loadWorkspace(membership.workspace_id);

  const { data, error } = await supabase.rpc('create_couple_workspace');
  if (error) throw error;
  return loadWorkspace(data);
}

async function loadWorkspace(result) {
  const id = typeof result === 'string'
    ? result
    : result?.workspace_id || result?.[0]?.workspace_id;
  if (!id) throw new Error('Workspace nije pronađen.');

  const { data, error } = await supabase
    .from('couple_workspaces')
    .select('invite_token')
    .eq('id', id)
    .single();
  if (error) throw error;

  window.localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);

  return { id, inviteToken: data.invite_token, isPrivate: true };
}

export function inviteUrl(inviteToken) {
  const url = new URL(window.location.origin);
  url.searchParams.set('invite', inviteToken);
  return url.toString();
}
