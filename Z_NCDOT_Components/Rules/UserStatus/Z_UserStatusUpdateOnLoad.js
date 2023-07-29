import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';


export default function Z_UserStatusUpdateOnLoad(context) {
    let userStat = libCommon.getStateVariable(context, 'ZSelectedUserStatus');
    // let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
    // if (fromNoti) {
    //     userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
    // } else {
    //     userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
    // }

    if (userStat) {
        let pageProxy = context.getPageProxy();
        let pageData = pageProxy.getClientData();

        pageData.selectedItems = userStat.split(' ');
    }
}
