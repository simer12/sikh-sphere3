export interface Gurdwara {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  type?: string;
  rating?: number;
  userRatingsTotal?: number;
  photos?: string[];
  contact?: string;
  directionsUrl?: string;
}
