import { Artist, Album, Track } from '../interfaces';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
