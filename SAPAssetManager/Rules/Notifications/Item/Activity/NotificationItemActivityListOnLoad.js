
import notificationListViewOnLoad from '../../ListView/NotificationListViewOnLoad';
import notificationItemActivityCount from './CreateUpdate/NotificationItemActivitiesCount';

export default function NotificationItemActivityListOnLoad(clientAPI) {
    return notificationItemActivityCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_items_activities_x',[count]));
        return notificationListViewOnLoad(clientAPI);
    });
}
