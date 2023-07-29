import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusUpdatePMMobileStatus(context) {
    let updateStatus = libCommon.getStateVariable(context, 'ZSelectedUserStatus');
    let readlink = '';
    let userStat = '';

    let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
    if (fromNoti) {
        userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
        readlink = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav['@odata.readLink'];
    } else {
        userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
        readlink = context.getPageProxy().binding.OrderMobileStatus_Nav['@odata.readLink'];
    }

    if (updateStatus === userStat) {
        return context.executeAction('/Z_NCDOT_Components/Actions/Z_CloseModelCancel.action');
    }

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
        'Properties':
        {
            'Properties':
            {
                'UserStatusCode': updateStatus
            },
            'Target':
            {
                'EntitySet': 'PMMobileStatuses',
                'ReadLink': readlink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Headers': {
                'OfflineOData.NonMergeable': false
            },
            "ValidationRule": "/Z_NCDOT_Components/Rules/UserStatus/Z_UserStatusUpdatePMMobileStatusOnValidate.js",
            "OnSuccess": "/Z_NCDOT_Components/Rules/UserStatus/Z_UserStatusUpdatePMMobileStatusOnSuccess.js",
            "OnFailure": "/Z_NCDOT_Components/Rules/UserStatus/Z_UserStatusUpdatePMMobileStatusOnFailure.js",
        },
    });

}
