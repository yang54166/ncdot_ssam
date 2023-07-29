import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}
function updateUserStatus(context, items) {
    libCommon.setStateVariable(context, 'ZSelectedUserStatus', items.join(' '));
}

export default function Z_UserStatusEvalSelectedStatusNumbered(context) {
    let pageProxy = context.getPageProxy();
    let bindingObj = pageProxy.getActionBinding();
    let pageData = pageProxy.getClientData();
    let pressedItem = bindingObj.UserStatus;
    let userStatusList = libCommon.getStateVariable(context, 'zzNbrStatusList');
   // let promise = Promise.resolve();

    if (pageData.selectedItems) {
        let items = pageData.selectedItems;

        if (items.includes(pressedItem)) {
            // if selection already exist - ignore the selection - can not send in empty selection
            return '';
        }

        for (let i = 0; i < items.length; i++) {
            if (userStatusList.includes(items[i])) {
                items = arrayRemove(items, items[i]);  // remove old number user status
            }
        }
        items.push(pressedItem);

        libCommon.setStateVariable(context, 'ZNewNbrUserStatus', pressedItem);
        pageData.selectedItems = items;
        updateUserStatus(context, items);
    } else {
        let items = [];
        items.push(pressedItem);
        pageData.selectedItems = items;
        updateUserStatus(context, items);
    }

    const sectionedTable = pageProxy.getControl('SectionedTable0');
    let objTable = sectionedTable.getSection('SectionObjectTable0');
    objTable.redraw();

    return '';
}