import {EntityRepository, Repository} from "typeorm";
import Unit from "./units.entity";

@EntityRepository(Unit)
class UnitRepository extends Repository<Unit> {
}

export default UnitRepository;
