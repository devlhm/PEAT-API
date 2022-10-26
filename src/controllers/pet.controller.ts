import { Request, Response } from 'express';
import { update, find, findAll, remove } from '../models/pet.model';

export const add = async (req: Request, res: Response) => {

}

export const getOne = async (req: Request, res: Response) => {
    const pet = await find(req.body.userId, req.params.id);

    if (pet) {
        res.status(200).json(pet);
    } else {
        res.status(404).json({ message: "Pet não encontrado" });
    }
}

export const getAllFromUser = async (req: Request, res: Response) => {
    const pets = await findAll(req.body.userId);

    if (pets) {
        res.status(200).json(pets)
    } else {
        res.status(404).json({ message: "Pets não encontrados" });
    }
}

export const edit = async (req: Request, res: Response) => {
    const result = await update(req.body.userId, req.params.id, req.body.pet);

    if (result) {
        res.sendStatus(200);
    } else {
        res.status(404).json({ message: "Pet não encontrado" });
    }
}

export const erase = async (req: Request, res: Response) => {
    const result = await remove(req.body.userId, req.params.id);
}

//TODO: terminar controller