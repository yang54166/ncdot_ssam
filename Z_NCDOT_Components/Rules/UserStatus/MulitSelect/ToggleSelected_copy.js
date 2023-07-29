import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}
function updateUserStatus(context, items) {

    libCommon.setStateVariable(context, 'ZSelectedUserStatus', items.join(' '));

    // let fromNoti = context.getPageProxy().binding["@odata.id"].includes('MyNotificationHeaders');
    // let readlink = '';

    // if (fromNoti){
    //     readlink = context.getPageProxy().getBindingObject().NotifMobileStatus_Nav['@odata.readLink'];
    // }else {
    //     readlink = context.getPageProxy().binding.OrderMobileStatus_Nav['@odata.readLink'];
    // }

    // return context.executeAction({
    //     'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
    //     'Properties':
    //     {
    //         'Properties':
    //         {
    //             'UserStatusCode': items.join(' ')
    //         },
    //         'Target':
    //         {
    //             'EntitySet': 'PMMobileStatuses',
    //             'ReadLink': readlink,
    //             'Service': '/SAPAssetManager/Services/AssetManager.service',
    //         },
    //         'Headers': {
    //             'OfflineOData.NonMergeable': false
    //         },

    //     },
    // });

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
    return promise.then(() => {
        const sectionedTable = pageProxy.getControl('SectionedTable0');
        let gridTable = sectionedTable.getSection('SectionGridTable0');
        let objTable = sectionedTable.getSection('SectionObjectTable0');
        gridTable.redraw();
        objTable.redraw();
    })



}