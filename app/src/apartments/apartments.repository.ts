import {EntityRepository, Repository} from "typeorm";
import Apartment from "./apartments.entity";

@EntityRepository(Apartment)
class ApartmentRepository extends Repository<Apartment> {
}

export default ApartmentRepository;
