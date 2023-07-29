
import notificationItemCauseCount from './NotificationItemCausesCount';
import notificationListViewOnLoad from '../../ListView/NotificationListViewOnLoad';
export default function NotificationItemCauseListOnLoad(clientAPI) {
    return notificationItemCauseCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_items_causes_x',[count]));
        return notificationListViewOnLoad(clientAPI);
    });
}
