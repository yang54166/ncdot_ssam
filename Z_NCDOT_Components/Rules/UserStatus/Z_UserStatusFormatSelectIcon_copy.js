/**
 * Describe this function...
 * @param {IClientAPI} context
 * 
 */
export default function Z_UserStatusFormatSelectIcon(context) {
    let userStat = '';
    let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
      if (fromNoti){
        userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
      }else{
        userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
      }


        let status = context.binding.UserStatus;
        if  (userStat && userStat.includes(status)){
            return ['sap-icon://sys-enter-2'];
        }
        return [];
    }
