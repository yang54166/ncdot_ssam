import common from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function DamageGroupLabel(context) {
    let notifType = '';
    ///Check if notification object is on the binding for different odata type objects to get notification type
    if (context.binding.Notification) {
        notifType = context.binding.Notification.NotificationType;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        ///If odata type is Notification Header use the property
        notifType = context.binding.NotificationType;
    } else {
        ///Get type from state variable if binding not available or during a changeset
        notifType = common.getStateVariable(context, 'CreateNotification').NotificationType;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notifType}')`, [], '').then(data => {
        if (data.length > 0 && data.getItem(0).NotifCategory === '02') {
            return context.localizeText('defect');
        } else {
            return 'Adtl. Info' ; // hlf - NCDOT change code label context.localizeText('damage_group');
        }
    });
}
