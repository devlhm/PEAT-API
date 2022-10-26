import { ResourceController } from "./ResourceController";
import { Pet, petModel } from '../models/PetModel';

export class PetController extends ResourceController<Pet> {
    protected model = petModel;
}
