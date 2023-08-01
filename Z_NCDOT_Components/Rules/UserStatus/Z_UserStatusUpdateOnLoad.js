import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';


export default function Z_UserStatusUpdateOnLoad(context) {
    let userStat = libCommon.getStateVariable(context, 'ZSelectedUserStatus');

    if (userStat) {
        let pageProxy = context.getPageProxy();
        let pageData = pageProxy.getClientData();

        pageData.selectedItems = userStat.split(' ');
    }
}
