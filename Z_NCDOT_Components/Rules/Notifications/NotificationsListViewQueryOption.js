import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import libPersona from '../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import phaseModel from '../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import phaseModelExpands from '../../../SAPAssetManager/Rules/PhaseModel/PhaseModelListViewQueryOptionExpand';
import notificationsListGetTypesQueryOption from '../../../SAPAssetManager/Rules/Notifications/ListView/NotificationsListGetTypesQueryOption';
import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationsListViewQueryOption(context) {
    let ignoreFilter = false;
    let pageName = libCommon.getPageName(context);

    if (pageName === 'WorkOrderDetailsPage') {
        ignoreFilter = true; //Do not filter if calling from work order details for notif singleton
    }
    return notificationsListGetTypesQueryOption(context).then(typesQueryOption => {
        let queryBuilder = context.dataQueryBuilder();
        //hlf - add geometries 2305
        queryBuilder.expand('NotifGeometries/Geometry,WorkOrder,NotifPriority,NotifMobileStatus_Nav,NotifDocuments,NotifDocuments/Document,HeaderLongText,FunctionalLocation,Equipment,NotifMobileStatus_Nav/OverallStatusCfg_Nav,Tasks,Activities,Items,Items/ItemActivities,Items/ItemCauses,Items/ItemTasks');
        queryBuilder.orderBy('Priority,ObjectKey,NotificationNumber,OrderId,NotifDocuments/DocumentID,NotifMobileStatus_Nav/MobileStatus');
        if (phaseModel(context)) {
            let phaseModelNavlinks = phaseModelExpands('QMI');
            queryBuilder.expand(phaseModelNavlinks);
        }
    
        if (context.searchString) {
            let searchFilters = [
                `substringof('${context.searchString.toLowerCase()}', tolower(NotificationNumber))`,
                `substringof('${context.searchString.toLowerCase()}', tolower(NotificationDescription))`,
                //hlf
                `substringof('${context.searchString.toLowerCase()}', tolower(HeaderFunctionLocation))`,
                `substringof('${context.searchString.toLowerCase()}', tolower(FunctionalLocation/FuncLocDesc))`,
            ];
            queryBuilder.filter(searchFilters.join(' or '));
        }

        if (!ignoreFilter) {
            if (libPersona.isFieldServiceTechnician(context)) {
                queryBuilder.filter(typesQueryOption);
            }
            if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
                queryBuilder.orderBy('Priority');
                queryBuilder.filter(`HeaderEquipment eq '${context.binding.EquipId}'`);
            } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                queryBuilder.filter(`Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}' and itm/InspectionChar_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionChar_Nav/InspectionChar eq '${context.binding.InspectionChar}' and itm/InspectionChar_Nav/SampleNum eq '${context.binding.SampleNum}')`);
            } else if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                queryBuilder.filter('ReferenceType ne "X"');
            }
        }
        return queryBuilder;
    });
}
