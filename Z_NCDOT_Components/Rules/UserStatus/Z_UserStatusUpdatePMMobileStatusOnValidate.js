import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusResetStatusThenCancel(context) {

    let newStatus = libCommon.getStateVariable(context, 'ZNewNbrUserStatus');

    if (!newStatus){
        return Promise.resolve(true);
    }

    let statusProfile = libCommon.getStateVariable(context, 'zzUserStatusProfile');
    let userStat = '';

    let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
    if (fromNoti) {
        userStat = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav.UserStatusCode;
    } else {
        userStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatusCode;
    }

    let queryOptionNew = "$filter=StatusProfile eq '" + statusProfile + "' and UserStatus eq '" + newStatus + "'";
    let queryOptionStatusList = "$filter=StatusProfile eq '" + statusProfile + "' and ZZStatusNbr ne '00'";
    let newStat = context.read('/SAPAssetManager/Services/AssetManager.service', 'UserStatuses',[], queryOptionNew)
                    .then((result)=> {
                        return result.getItem(0);
                    });
    let statusList = context.read('/SAPAssetManager/Services/AssetManager.service', 'UserStatuses', [], queryOptionStatusList)
                        .then(results=>{
                            return results;
                        });

    return Promise.all([newStat, statusList]).then(resultsArray =>{
        let newStatNbr = resultsArray[0].ZZStatusNbr;

        let statList = resultsArray[1];  // this is the user list by profile
        let stat = '';

        for (var i = 0; i < statList.length; i++) {
            stat = statList.getItem(i);
            if (userStat.includes(stat.UserStatus)) {
                if (Number(stat.ZZHighestNbr) < Number(newStatNbr) ||  
                    Number(stat.ZZLowestNbr) > Number(newStatNbr)) { 
                    return Promise.reject();
                }
            }
        }
        return Promise.resolve(true);
    });
}
