import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import Unit from "./units.entity";

@EntityRepository(Unit)
class UnitRepository extends Repository<Unit> {
}

const getUnitRepository = () => getCustomRepository(UnitRepository);

export default getUnitRepository;
