import type { ProjectState } from '../domain/state';

// Commands share the current project aggregate and report persistence failure.
export interface ProjectRepository {
  read(): ProjectState;
  transact(change: (current: ProjectState) => ProjectState): boolean;
}
