import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import Apartment from "./apartments.entity";

@EntityRepository(Apartment)
class ApartmentRepository extends Repository<Apartment> {
}

const getApartmentRepository = () => getCustomRepository(ApartmentRepository);

export default getApartmentRepository;
