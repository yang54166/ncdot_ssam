import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function Z_UserStatusOverviewNav(context) {

    let filterQuery = '';
   
    libCommon.removeStateVariable(context, 'zzUserStatusProfile');
    libCommon.removeStateVariable(context, 'zzNbrStatusList');
    libCommon.removeStateVariable(context, 'ZSelectedUserStatus');

    let pmStatus = '';

    let userStat = '';
    let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
      if (fromNoti){
        userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
        pmStatus = context.binding.NotifMobileStatus_Nav.StatusProfile;
      }else{
        userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
        pmStatus = context.binding.OrderMobileStatus_Nav.StatusProfile;
      }

    libCommon.setStateVariable(context, 'ZSelectedUserStatus', userStat);
    libCommon.setStateVariable(context, 'zzUserStatusProfile', pmStatus);

    filterQuery = "$filter=StatusProfile eq '" + pmStatus + "' and ZZStatusNbr ne '00'";
   
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserStatuses', [], filterQuery).then(result => {
        if (result) {
            let statusNbr = [];
            for (let i = 0; i < result.length; i++) {
                statusNbr.push(result.getItem(i).UserStatus);
            }
            libCommon.setStateVariable(context, 'zzNbrStatusList', statusNbr);
        }
        return context.executeAction('/Z_NCDOT_Components/Actions/UserStatus/Z_UserStatusOverviewNav.action');
    })

}
