import express from 'express';
import * as songController from '../controllers/songController.js';

const router = express.Router();

router.get('/', songController.getAllSongs);
router.get('/search', songController.getSongsByArtist);
router.get('/:id', songController.getSongById);
router.post('/', songController.createSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

export default router;
