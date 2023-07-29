import CommonLibrary from '../../Common/Library/CommonLibrary';
import RelatedNotifReadlink from './NotificationHistoryReadLink';
export default function PendingNotificationCount(context) {
    let entity = context.getPageProxy();
    let notificationReadLink = RelatedNotifReadlink(entity);
    return Promise.resolve(notificationReadLink).then((link) => {
        return CommonLibrary.getEntitySetCount(context, link, "$filter=ReferenceType eq 'P'");
    });
}
