import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusDisplayStatusSelected(context) {
   let selectedStatus = libCommon.getStateVariable(context, 'ZSelectedUserStatus');

    // let userStat = '';
    // let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
    //   if (fromNoti){
    //     userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
    //   }else{
    //     userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
    //   }

 let status = context.binding.UserStatus;

    if ( selectedStatus && selectedStatus.includes(status)) {
        return true;
    }
    return false;
}
