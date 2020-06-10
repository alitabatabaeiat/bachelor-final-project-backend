import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import UnitCharge from "./unitCharges.entity";

@EntityRepository(UnitCharge)
class UnitChargeRepository extends Repository<UnitCharge> {
}

const getUnitChargeRepository = () => getCustomRepository(UnitChargeRepository);

export default getUnitChargeRepository;
