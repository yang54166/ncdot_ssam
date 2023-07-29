import { WorkOrderLibrary as libWo } from '../../../../SAPAssetManager/Rules/WorkOrders/WorkOrderLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function WorkOrderCreateUpdateRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'PlanningPlantLstPkr',
        'TypeLstPkr',
        'PrioritySeg',
        'MainWorkCenterLstPkr',
    ];

    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal){
        req.push('Z_MaintActType');
    //     req.push('Z_wbsListPkr');
    //     req.push('Z_functionAreaLstPkr');
     }

    return libWo.isSoldPartyRequired(context).then((required) => {
        if (required) {
            requiredFields.push('SoldToPartyLstPkr');
        }
        return requiredFields;
    });
}
