import { EntityRepository, Repository } from "typeorm";
import User from "./users.entity";

@EntityRepository(User)
class UserRepository extends Repository<User> {
}

export default UserRepository;
