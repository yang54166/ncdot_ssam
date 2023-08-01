import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import OperationsListViewWithResetFiltersNav from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/OperationsListViewWithResetFiltersNav';

export default function OperationsListViewNav(context) {
    libCom.setStateVariable(context,'FromOperationsAssignedList', false);
    libCom.setStateVariable(context,'FromOperationsList', true);
    return OperationsListViewWithResetFiltersNav(context);
}
