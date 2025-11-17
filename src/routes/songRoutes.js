import express from 'express';
import * as songController from '../controllers/songController.js';
import { logMiddleware } from "../middleware/logger.js"

const router = express.Router();

router.get("/", logMiddleware, songController.getAllSongs)
router.get('/search', songController.getSongsByArtist);
router.get('/:id', songController.getSongById);
router.post('/', songController.createSong);
router.put('/:id', songController.updateSong);
router.delete('/:id', songController.deleteSong);

export default router;
