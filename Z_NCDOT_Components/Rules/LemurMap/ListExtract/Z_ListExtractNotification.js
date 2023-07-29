export default function Z_ListExtractNotification(context) {

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], `$expand=NotifPriority,FunctionalLocation,Equipment,NotifMobileStatus_Nav,HeaderLongText,NotifGeometries/Geometry`)
        .then(result => {
            let notifications = [];
            let geometry = '';
            let oid = '';
            let flDesc = '';
            let priority = '';

            result.forEach(element => {
                oid = '';
                priority = '';
                flDesc = '';
                geometry = '';

                if (element.NotifGeometries.length > 0) {
                    geometry = element.NotifGeometries[0].Geometry.GeometryValue;
                    oid = element.NotifGeometries[0].Geometry.SpacialId;
                }           
                
                if (element.FunctionalLocation) {
                    flDesc = element.HeaderFunctionLocation  + ' - ' + element.FunctionalLocation.FuncLocDesc;
                }
             
                priority = element.Priority;
                if (element.NotifPriority){
                    priority = priority + ' - ' + context.binding.NotifPriority.PriorityDescription;
                }

                notifications.push(
                    {
                        'Noti': element.NotificationNumber,
                        'Desc': element.NotificationDescription,
                        'Type': element.NotificationType,
                        'Prio': priority,
                        'Sort': element.SortField,
                        'Break': element.BreakdownIndicator,
                        'RsDt': element.RequiredStartDate,
                        'ReDt': element.RequiredEndDate,
                        'WC': element.ExternalWorkCenterId,
                        'FL':  flDesc,
                        'WO': element.OrderId,                                                     
                        'Geo': geometry,
                        'OID': oid,
                        'Stat': element.NotifMobileStatus_Nav.MobileStatus
                    }
                );
            });
           
          
            return notifications;

        });
    }
