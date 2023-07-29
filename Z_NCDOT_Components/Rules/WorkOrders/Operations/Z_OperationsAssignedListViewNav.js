import libCom from '../../../../SAPAssetManager/Rules//Common/Library/CommonLibrary';
import OperationsListViewWithResetFiltersNav from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/OperationsListViewWithResetFiltersNav';

export default function Z_OperationsAssignedListViewNav(context) {

    libCom.setStateVariable(context,'FromOperationsAssignedList', true);
    return OperationsListViewWithResetFiltersNav(context);
}
