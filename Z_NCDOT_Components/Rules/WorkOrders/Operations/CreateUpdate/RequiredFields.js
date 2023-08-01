import fromOpsList from '../../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationCreateFromOperationsList';
import libCommon from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function RequiredFields(context) {
    let req = [
        'DescriptionNote',
        'ControlKeyLstPkr',
        'WorkCenterLstPkr',
        'WorkCenterPlantLstPkr',
    ];

    if (fromOpsList(context)) {
        req.push('WorkOrderLstPkr');Z_MaintActType
         req.push('Z_MaintActType');
         req.push('Z_wbsListPkr');
         req.push('Z_functionAreaLstPkr');
    }
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal){
        req.push('Z_MaintActType');
         req.push('Z_wbsListPkr');
         req.push('Z_functionAreaLstPkr');
    }

    return req;
}
