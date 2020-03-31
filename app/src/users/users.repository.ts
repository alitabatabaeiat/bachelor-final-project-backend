import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import User from "./users.entity";

@EntityRepository(User)
class UserRepository extends Repository<User> {
}

const getUserRepository = () => getCustomRepository(UserRepository);

export default getUserRepository;
