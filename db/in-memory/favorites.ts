import {
  Album,
  Artist,
  Favorites,
  FavoritesResponse,
  Track,
} from '../../src/interfaces';

export class FavoritesTable {
  _table: Favorites;

  _tracksFav: Track[];
  _artistsFav: Artist[];
  _albumsFav: Album[];

  constructor() {
    this._table = { artists: [], albums: [], tracks: [] };
    this._tracksFav = [];
    this._artistsFav = [];
    this._albumsFav = [];
  }

  async insertTrack(track: Track) {
    this._tracksFav.push(track);

    return this._table.tracks.push(track.name);
  }

  async insertArtist(artist: Artist) {
    this._artistsFav.push(artist);

    return this._table.artists.push(artist.name);
  }

  async insertAlbum(album: Album) {
    this._albumsFav.push(album);

    return this._table.albums.push(album.name);
  }

  async findAll(): Promise<FavoritesResponse> {
    return {
      artists: this._artistsFav,
      tracks: this._tracksFav,
      albums: this._albumsFav,
    };
  }

  async deleteTrack(track: Track) {
    this._table.tracks = this._table.tracks.filter(
      (trackName) => trackName !== track.name,
    );

    return this._table.tracks;
  }

  async deleteAlbum(album: Album) {
    this._table.albums = this._table.albums.filter(
      (albumName) => albumName !== album.name,
    );

    return this._table.albums;
  }

  async deleteArtist(artist: Artist) {
    this._table.artists = this._table.artists.filter(
      (artistName) => artistName !== artist.name,
    );

    return this._table.artists;
  }
}
