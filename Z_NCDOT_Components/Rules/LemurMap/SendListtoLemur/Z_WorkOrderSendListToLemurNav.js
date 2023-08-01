
import Z_ListExtractWorkOrder from '../ListExtract/Z_ListExtractWorkOrder';

export default function Z_NotificationSendListToLemurNav(context) {

    let orders = Z_ListExtractWorkOrder(context);

    return Promise.all([orders]).then( resultsArray => {
        let orderList =  resultsArray[0];

        return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(orderList))}`);
    })
}
    