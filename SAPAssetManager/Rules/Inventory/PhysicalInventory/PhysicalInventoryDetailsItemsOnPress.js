import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDetailsItemsOnPress(context) {
    libCom.removeStateVariable(context, 'PIDetailsScreenActiveTabCounted');
    if (libCom.getStateVariable(context, 'RedrawPIItems')) {
        libCom.removeStateVariable(context, 'RedrawPIItems');
        context.evaluateTargetPathForAPI('#Page:PhysicalInventoryItemsListPage').getControl('SectionedTable').getSection('SectionObjectTable0').redraw();
    }
 
}
