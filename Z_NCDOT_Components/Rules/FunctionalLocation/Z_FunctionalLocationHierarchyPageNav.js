
import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_FunctionalLocationHierarchyPageNav(context) {
    let mainFloc = '';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocId eq 'HD'`).then(main => {
    mainFloc = main.getItem(0);
    let funcLocId = main.getItem(0).FuncLocIdIntern;
    let equipChildrenCountPromise =  libCom.getEntitySetCount(context, 'MyEquipments', "$filter=FuncLocIdIntern eq '" + funcLocId + "' and SuperiorEquip eq ''&$orderby=FuncLocIdIntern,SuperiorEquip");
    let funcLocChildrenCountPromise =  libCom.getEntitySetCount(context, 'MyFunctionalLocations', "$filter=SuperiorFuncLocInternId eq '" + funcLocId + "'&$orderby=SuperiorFuncLocInternId");
    return Promise.all([equipChildrenCountPromise, funcLocChildrenCountPromise]).then(function(resultsArray) {
        if (resultsArray) {
            var totalChildCount = resultsArray[0] + resultsArray[1];
            mainFloc.HC_ROOT_CHILDCOUNT = totalChildCount;
            context.getPageProxy().setActionBinding(mainFloc);
            return context.executeAction('/SAPAssetManager/Actions/HierarchyControl/HierarchyControlPageNav.action');
        }
        return Promise.resolve();
    });
});
}
