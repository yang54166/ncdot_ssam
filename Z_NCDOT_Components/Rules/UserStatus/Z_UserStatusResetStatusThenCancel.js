import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusResetStatusThenCancel(context) {

    let userStat = '';
    let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
      if (fromNoti){
        userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
      }else{
        userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
      }

    libCommon.setStateVariable(context, 'ZSelectedUserStatus', userStat);

    return context.executeAction('/Z_NCDOT_Components/Actions/Z_CloseModelCancel.action');
}
