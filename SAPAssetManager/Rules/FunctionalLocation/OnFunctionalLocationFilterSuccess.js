import CommonLibrary from '../Common/Library/CommonLibrary';
export default function OnFunctionalLocationFilterSuccess(context) {
    let queryOption = CommonLibrary.getQueryOptionFromFilter(context);
    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', '');
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations',queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(counts) {
        let totalCount = counts[0];
        let count = counts[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('functional_location_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('functional_location_x_x', params));
    });
}
