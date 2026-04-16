export interface Amenity {
  id: string;
  name: string;
  type: string;
  waitTime: number;
  statusColor: 'green' | 'yellow' | 'red';
  distance?: string;
}

export interface UserContext {
  pnr: string;
  section: string;
  seat: string;
}
