import { useProject } from '../../project/store';

export function useReservations() {
  const {reservations, log} = useProject();
  return {...reservations, appointments:reservations.list(), log};
}
