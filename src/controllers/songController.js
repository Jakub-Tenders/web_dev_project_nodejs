import * as songService from '../services/songService.js';

export const getAllSongs = (req, res) => {
  try {
    const songs = songService.getAllSongs();
    res.status(200).json(songs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getSongById = (req, res) => {
  try {
    const song = songService.getSongById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.status(200).json(song);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getSongsByArtist = (req, res) => {
  try {
    const { artist } = req.query;
    if (!artist) {
      return res.status(400).json({ message: 'Artist query parameter is required' });
    }
    const songs = songService.getSongsByArtist(artist);
    res.status(200).json(songs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createSong = (req, res) => {
  try {
    const { title, artist, album, duration } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ message: 'Title and artist are required' });
    }
    const created = songService.createSong({ title, artist, album, duration });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateSong = (req, res) => {
  try {
    const { title, artist, album, duration } = req.body;
    const updated = songService.updateSong(req.params.id, { title, artist, album, duration });
    if (!updated) return res.status(404).json({ message: 'Song not found' });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteSong = (req, res) => {
  try {
    const ok = songService.deleteSong(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Song not found' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
