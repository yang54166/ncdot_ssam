import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import WOMobileLib from '../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';

export default function WorkOrdersListViewNav(context) {
    libCom.setStateVariable(context, 'WorkOrderListFilter', 'ALL_JOBS');
    libCom.setStateVariable(context, 'WORKORDER_FILTER', '$filter=');
    libCom.setStateVariable(context,'FromOperationsList', false);
    libCom.setStateVariable(context,'FromOperationsAssignedList', false);
    return WOMobileLib.isAnyWorkOrderStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    });
}
