import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import Charge from "./charges.entity";

@EntityRepository(Charge)
class ChargeRepository extends Repository<Charge> {
}

const getChargeRepository = () => getCustomRepository(ChargeRepository);

export default getChargeRepository;
