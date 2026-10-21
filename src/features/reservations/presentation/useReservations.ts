import { useProject } from '../../project/presentation';

export function useReservations() {
  const {reservations, log} = useProject();
  return {...reservations, appointments:reservations.list(), log};
}
