import Logger from '../../Log/Logger';
import libWOMobile from '../MobileStatus/WorkOrderMobileStatusLibrary';

export default function WorkOrdersHighPriorityListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrdersListViewNav called');

    let actionBinding = {
        isHighPriorityList: true,
    };
    // Make this action binding distinct from a generic object
    // This is not an OData Binding
    let Override = function() {};
    actionBinding.constructor = Override;

    context.getPageProxy().setActionBinding(actionBinding);
    return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    });
}
