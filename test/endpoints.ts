export const usersRoutes = {
  getAll: '/users',
  getById: (userId) => `/users/${userId}`,
  create: '/users',
  update: (userId) => `/users/${userId}`,
  delete: (userId) => `/users/${userId}`,
};

export const artistsRoutes = {
  getAll: '/artists',
  getById: (artistId) => `/artists/${artistId}`,
  create: '/artists',
  update: (artistId) => `/artists/${artistId}`,
  delete: (artistId) => `/artists/${artistId}`,
};

export const albumsRoutes = {
  getAll: '/albums',
  getById: (albumId) => `/albums/${albumId}`,
  create: '/albums',
  update: (albumId) => `/albums/${albumId}`,
  delete: (albumId) => `/albums/${albumId}`,
};

export const tracksRoutes = {
  getAll: '/tracks',
  getById: (trackId) => `/tracks/${trackId}`,
  create: '/tracks',
  update: (trackId) => `/tracks/${trackId}`,
  delete: (trackId) => `/tracks/${trackId}`,
};

export const favoritesRoutes = {
  getAll: '/favs',
  artists: (artistId) => `/favs/artist/${artistId}`,
  albums: (albumId) => `/favs/album/${albumId}`,
  tracks: (trackId) => `/favs/track/${trackId}`,
};

export const authRoutes = {
  signup: '/auth/signup',
  login: '/auth/login',
  refresh: '/auth/refresh',
};
