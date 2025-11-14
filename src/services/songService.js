import Song from '../models/Song.js';

export const getAllSongs = () => Song.findAll();

export const getSongById = (id) => Song.findById(id);

export const getSongsByArtist = (artist) => Song.findByArtist(artist);

export const createSong = ({ title, artist, album, duration }) => {
  if (!title || !artist) {
    throw new Error('Title and artist are required');
  }
  return Song.create({ title, artist, album, duration });
};

export const updateSong = (id, { title, artist, album, duration }) => {
  const existing = Song.findById(id);
  if (!existing) return null;
  return Song.update(id, { title, artist, album, duration });
};

export const deleteSong = (id) => Song.delete(id);