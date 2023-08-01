export default function Z_SelectedNotificationToLemurNav(context) {
    let oid = '';
    let geometry = '';
    let flDesc = '';

    if (context.binding.NotifGeometries.length > 0) {
        geometry = context.binding.NotifGeometries[0].Geometry.GeometryValue;
        oid = context.binding.NotifGeometries[0].Geometry.SpacialId;
    }
    // let equipDesc = '';
    // if (element.Equipment) {
    //     equipDesc = context.binding.HeaderEquipment + ' - ' + context.binding.HeaderEquipment.EquipDesc;
    // }

    if (context.binding.FunctionalLocation) {
        flDesc = context.binding.HeaderFunctionLocation  + ' - ' + context.binding.FunctionalLocation.FuncLocDesc;
    }
    let priority = context.binding.Priority;
    if (context.binding.NotifPriority){
        priority = priority + ' - ' + context.binding.NotifPriority.PriorityDescription;
    }


    let notification =
    {
        "Notifications": [
            {
                'Noti': context.binding.NotificationNumber,
                'Desc': context.binding.NotificationDescription,
                'Type': context.binding.NotificationType,
                'Prio': priority,
                'Sort': context.binding.SortField,
                'Break': context.binding.BreakdownIndicator,
                'RsDt': context.binding.RequiredStartDate,
                'ReDt': context.binding.RequiredEndDate,
                'WC': context.binding.ExternalWorkCenterId,
                'FL': flDesc ,
                'WO': context.binding.OrderId,                                 
               // 'EQ': equipDesc,                       
                'Geo': geometry,
                'OID': oid,
                'Stat': context.binding.NotifMobileStatus_Nav.MobileStatus
                
            }
        ]
    };

   // return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${JSON.stringify(notification)}`)
    return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(notification))}`);


}

