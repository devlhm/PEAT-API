import express from 'express';
import { getOne, getAllFromUser } from '../controllers/pet.controller';
export const router = express.Router();

router.get('/:id', getOne);
router.get('/', getAllFromUser)

//TODO : terminar rota