import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import AppNotification from "./notifications.entity";

@EntityRepository(AppNotification)
class NotificationRepository extends Repository<AppNotification> {
}

const getNotificationRepository = () => getCustomRepository(NotificationRepository);

export default getNotificationRepository;
