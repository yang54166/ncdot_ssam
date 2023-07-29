import notificationItemTaskCount from './NotificationItemTasksCount';
import notificationListViewOnLoad from '../../ListView/NotificationListViewOnLoad';


export default function NotificationItemTaskListOnLoad(context) {
    return notificationItemTaskCount(context.getControls()[0]).then(count => {
        context.setCaption(context.localizeText('notification_item_tasks_x',[count]));
        return notificationListViewOnLoad(context);
    });
    
}
