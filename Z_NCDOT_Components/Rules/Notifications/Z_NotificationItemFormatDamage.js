 import damageGrp from '../../../SAPAssetManager/Rules/Notifications/Item/Details/NotificationItemDetailsPartGroup'
 import damageCd  from '../../../SAPAssetManager/Rules/Notifications/Item/Details/NotificationItemDetailsPart'

export default function Z_NotificationItemFormatDamage(context) {
    let group = damageGrp(context);
    let code = damageCd(context);
        return Promise.all([group, code]).then(results => {
            return results[0] + '  -  ' + results[1];
        })

}
