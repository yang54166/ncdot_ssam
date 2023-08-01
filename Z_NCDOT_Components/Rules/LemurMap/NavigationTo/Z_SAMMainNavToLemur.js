import Z_ListExtractFloc from '../ListExtract/Z_ListExtractFloc';
import Z_ListExtractNotification from '../ListExtract/Z_ListExtractNotification';
import Z_ListExtractWorkOrder from '../ListExtract/Z_ListExtractWorkOrder';


export default function Z_SAMMainNavToLemur(context) {

  let flocs = Z_ListExtractFloc(context);
  let notis = Z_ListExtractNotification(context);
  let orders = Z_ListExtractWorkOrder(context);

  return Promise.all([flocs, notis, orders]).then( resultsArray => {
      let flList =  resultsArray[0];
      let notiList = resultsArray[1];
      let woList = resultsArray[2];
      let ssamList = [];

      ssamList.push(
        {
            'workorders': woList,
            'notifications': notiList,
            'funclocs': flList
        })

    // const utils = context.nativescript.utilsModule;
     
    //   const URI1 = `ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify({ "Work_Orders": workOrders }))}`;
    //   utils.openUrl(URI1);
    //   return true;

      return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(ssamList))}`);
  });

  
}
