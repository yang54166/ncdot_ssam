import Z_ListExtractNotification from '../ListExtract/Z_ListExtractNotification';

export default function Z_NotificationSendListToLemurNav(context) {

    let notis = Z_ListExtractNotification(context);

    return Promise.all([notis]).then( resultsArray => {
        let notiList =  resultsArray[0];

        return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(notiList))}`);
    })

    // return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], `$expand=NotifPriority,FunctionalLocation,Equipment,NotifMobileStatus_Nav,HeaderLongText,NotifGeometries/Geometry`)
    //     .then(result => {
    //         let notifications = [];
    //         let geometry = '';
    //         let oid = '';
    //        // let equipDesc = '';
    //         let flDesc = '';
    //         let priority = '';

    //         result.forEach(element => {
    //             oid = '';
    //             priority = '';
    //             //equipDesc = '';
    //             flDesc = '';
    //             geometry = '';


    //             if (element.NotifGeometries.length > 0) {
    //                 geometry = element.NotifGeometries[0].Geometry.GeometryValue;
    //                 oid = element.NotifGeometries[0].Geometry.SpacialId;
    //             }
               
    //             // if (element.Equipment) {
    //             //     equipDesc = context.binding.HeaderEquipment + ' - ' + element.HeaderEquipment.EquipDesc;
    //             // }
                
    //             if (element.FunctionalLocation) {
    //                 flDesc = element.HeaderFunctionLocation  + ' - ' + element.FunctionalLocation.FuncLocDesc;
    //             }

                
    //             if (element.Priority){
    //                 priority = element.Priority + ' - ' + element.NotifPriority.PriorityDescription;
    //             }


    //             notifications.push(
    //                 {
    //                     'Noti': element.NotificationNumber,
    //                     'Desc': element.NotificationDescription,
    //                     'Type': element.NotificationType,
    //                     'Prio': priority,
    //                     'Sort': element.SortField,
    //                     'Break': element.BreakdownIndicator,
    //                     'RsDt': element.RequiredStartDate,
    //                     'ReDt': element.RequiredEndDate,
    //                     'WC': element.ExternalWorkCenterId,
    //                     'FL':  flDesc,
    //                     'WO': element.OrderId,                                                     
    //                     'Geo': geometry,
    //                     'OID': oid
    //                 }
    //             );
    //         });
           
    //        const utils = context.nativescript.utilsModule;

    //         const URI1 = `ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify({ "NotificationList": notifications }))}`;
    //         utils.openUrl(URI1);
    //         return true;

    //     });
    }
