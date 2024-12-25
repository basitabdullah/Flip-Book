import express from 'express';
import {
    getAllPages,
    getPageByNumber,
    createPage,
    updatePage,
    deletePage,
} from '../controllers/pageController.js';

const router = express.Router();

router.get('/', getAllPages);
router.get('/:pageNumber', getPageByNumber);
router.post('/', createPage);
router.put('/:pageNumber', updatePage);
router.delete('/:pageNumber', deletePage);

export default router;
