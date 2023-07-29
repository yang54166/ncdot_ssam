import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_OperationDisplayStartedOpId(context) {

    let user = libCommon.getSapUserName(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', `PMMobileStatuses`, [], `$filter=ObjectType eq 'OVG' and CreateUserId eq '${user}' and MobileStatus eq 'STARTED' `)
        .then(status => {
            if (status.length > 0){
                return status.getItem(0).OrderId + '-' + status.getItem(0).OperationNo;
            }
            return '';
    });
}
