export type Branch = {
  id: string;
  name: string;
  area: string;
  address?: string;
  phone?: string;
  lat: number;
  lng: number;
};

export const branches: Branch[] = [
  {
    id: "main-hinjawadi-laxmi-chowk",
    name: "Main Branch",
    area: "Laxmi Chowk, Hinjawadi",
    lat: 18.5916,
    lng: 73.7345,
    phone: "+919309883798",
  },
  {
    id: "kaspatewasti-wakad",
    name: "Kaspatewasti, Wakad",
    area: "Wakad",
    lat: 18.5978,
    lng: 73.7726,
    phone: "+919309883798",
  },
  {
    id: "hinjawadi-phase-3",
    name: "Hinjawadi, PH-3",
    area: "Hinjawadi Phase 3",
    lat: 18.5865,
    lng: 73.7018,
    phone: "+919309883798",
  },
  {
    id: "bhumkar-chowk-wakad",
    name: "Bhumkar Chowk, Wakad",
    area: "Wakad",
    lat: 18.6002,
    lng: 73.7599,
    phone: "+919309883798",
  },
  {
    id: "datta-mandir-road-wakad",
    name: "Datta Mandir Road, Wakad",
    area: "Wakad",
    lat: 18.6009,
    lng: 73.7802,
    phone: "+919309883798",
  },
];
