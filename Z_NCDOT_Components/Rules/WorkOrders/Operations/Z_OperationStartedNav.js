import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import opNav from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/Details/WorkOrderOperationDetailsNav';

export default function Z_OperationStartedNav(context) {
    let user = libCommon.getSapUserName(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', `PMMobileStatuses`, [], `$filter=ObjectType eq 'OVG' and CreateUserId eq '${user}' and MobileStatus eq 'STARTED' `)
        .then(status => {
            if (status.length > 0){
                let statusOP = status.getItem(0);
                let op = `MyWorkOrderOperations(OrderId='` + statusOP.OrderId +   `',OperationNo='` + statusOP.OperationNo + `')`;
                return context.read('/SAPAssetManager/Services/AssetManager.service', op,[],'').then (op => {
                    context.getPageProxy().setActionBinding(op.getItem(0));
                    return opNav(context);
                })
            }
            return '';
    });
}
