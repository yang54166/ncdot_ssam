import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}
function updateUserStatus(context, items) {
    libCommon.setStateVariable(context, 'ZSelectedUserStatus', items.join(' '));

}

export default function ToggleSelected(context) {
    let pageProxy = context.getPageProxy();
    let bindingObj = pageProxy.getActionBinding();
    let pageData = pageProxy.getClientData();
    let pressedItem = bindingObj.UserStatus;

    let promise = Promise.resolve();

    if (pageData.selectedItems) {
        let items = pageData.selectedItems;
        if (items.includes(pressedItem)) {
            items = arrayRemove(items, pressedItem);
        } else {
            items.push(pressedItem);
        }
        pageData.selectedItems = items;
        promise = updateUserStatus(context, items);
    } else {
        let items = [];
        items.push(pressedItem);
        pageData.selectedItems = items;
        promise = updateUserStatus(context, items);
    }
}