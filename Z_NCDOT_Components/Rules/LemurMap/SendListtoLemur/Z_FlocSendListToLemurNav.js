import Z_ListExtractFloc from '../ListExtract/Z_ListExtractFloc';

export default function Z_FlocSendListToLemurNav(context) {
   
    let flocs = Z_ListExtractFloc(context);

    return Promise.all([flocs]).then( resultsArray => {
        let flList =  resultsArray[0];

        return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(flList))}`);
    });
    
}
