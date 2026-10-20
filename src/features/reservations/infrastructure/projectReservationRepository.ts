import type { ProjectState } from '../../project/domain';
import type { ReservationRepository } from '../application/ReservationRepository';

type ProjectStorage = {
  read: () => ProjectState;
  save: (project: ProjectState) => void;
  isCurrent: () => boolean;
  onStorageError: () => void;
};

// The project remains the only aggregate stored: no reservation key or second table.
export function createProjectReservationRepository(storage: ProjectStorage): ReservationRepository {
  return {
    read: () => storage.read().appointments,
    transact: change => {
      if (!storage.isCurrent()) return {ok:false, errors:{}, reason:'staleProject'};
      const project = storage.read();
      const result = change(project.appointments);
      if (!result.ok) return result;
      try {
        storage.save({...project, appointments:result.appointments});
        return {ok:true, appointment:result.appointment};
      } catch {
        storage.onStorageError();
        return {ok:false, errors:{}, reason:'storageFailed'};
      }
    },
  };
}
