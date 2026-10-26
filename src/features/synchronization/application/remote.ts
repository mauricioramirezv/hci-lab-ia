import type { Catalogs, SyncAction } from '../domain/plan';
export type { Catalogs } from '../domain/plan';
export type Workspace = { id: string; name: string };
export type SyncAssignment = { id: string; title: string; groupName: string; activityVersionId: string };
export interface SyncRemote {
  listWorkspaces(signal?: AbortSignal): Promise<Workspace[]>;
  listExecutions(workspaceId: string, signal?: AbortSignal): Promise<Array<{ id: string; label: string }>>;
  listAssignments?(signal?: AbortSignal): Promise<SyncAssignment[]>;
  createWorkspace(name: string, key: string, signal?: AbortSignal): Promise<Workspace>;
  loadCatalogs(locale: string, signal?: AbortSignal): Promise<Catalogs>;
  perform(action: SyncAction, data: Record<string, unknown>, workspaceId: string, idempotencyKey: string, signal?: AbortSignal): Promise<Record<string, unknown>>;
}
