 import adtlInfoGrp from '../../../SAPAssetManager/Rules/Notifications/Item/Details/NotificationItemDetailsDamageGroup'
 import adtlInfoCd from '../../../SAPAssetManager/Rules/Notifications/Item/Details/NotificationItemDetailsDamage'

export default function Z_NotificationItemFormatAddtlInfo(context) {
    let group = adtlInfoGrp(context);
    let code = adtlInfoCd(context);
        return Promise.all([group, code]).then(results => {
            return results[0] + '  -  ' + results[1];
        })
   
}
