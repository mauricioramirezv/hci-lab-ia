import type { ProjectRepository } from '../application/ProjectRepository';
import type { ProjectState } from '../domain/state';

export function createProjectRepository(host: {
  read: () => ProjectState;
  isCurrent: () => boolean;
  save: (next: ProjectState) => void;
  onStorageError: () => void;
}): ProjectRepository {
  return {
    read: host.read,
    transact(change) {
      if (!host.isCurrent()) return false;
      const current=host.read(), next=change(current);
      if (next===current) return false;
      try { host.save(next); return true; }
      catch { host.onStorageError(); return false; }
    },
  };
}
