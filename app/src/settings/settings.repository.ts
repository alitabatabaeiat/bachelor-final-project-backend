import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import Setting from "./settings.entity";

@EntityRepository(Setting)
class SettingRepository extends Repository<Setting> {
}

const getSettingRepository = () => getCustomRepository(SettingRepository);

export default getSettingRepository;
