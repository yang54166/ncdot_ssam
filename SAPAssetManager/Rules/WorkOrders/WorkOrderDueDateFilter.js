
export default function WorkOrderDueDateFilter(context) {
    const pageName = context.currentPage.id;
    if (!pageName) return;

    let dueDateSwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:DueDateSwitch`);
    let switchValue = dueDateSwitch.getValue();

    let startDateControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:DueStartDateFilter`);
    let endDateControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:DueEndDateFilter`);
    startDateControl.setVisible(switchValue);
    endDateControl.setVisible(switchValue);

    let parentPageName = 'WorkOrdersListViewPage';
    if (pageName === 'ServiceOrderFilterPage') {
        parentPageName = 'ServiceOrdersListViewPage';
    }
    if (pageName === 'ServiceRequestFilterPage') {
        parentPageName = 'ServiceRequestsListViewPage';
    }
    // persist the date filter values
    let clientData = context.evaluateTargetPath(`#Page:${parentPageName}/#ClientData`);
    clientData.dueDateSwitch = switchValue;
}
