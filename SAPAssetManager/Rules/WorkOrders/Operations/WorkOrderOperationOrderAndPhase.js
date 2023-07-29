import libCom from '../../Common/Library/CommonLibrary';
import PhaseControlVisible from '../PhaseControl/PhaseControlVisible';
import Logger from '../../Log/Logger';

export default function WorkOrderOperationOrderAndPhase(context) {
    let orderId = context.binding.OrderId;

    if (PhaseControlVisible(context) && context.binding) {
        let mobileStatusEntity = context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' ? 'OrderMobileStatus_Nav' : 'OperationMobileStatus_Nav';
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/' + mobileStatusEntity + '/OverallStatusCfg_Nav', ['PhaseDesc'], '').then(result => {
            if (result.length && libCom.isDefined(result.getItem(0).PhaseDesc)) {
                return orderId ? `${orderId} - ${result.getItem(0).PhaseDesc}` : result.getItem(0).PhaseDesc;
            }
            return orderId;
        }).catch((error) => {
            Logger.error('EAMOverallStatusConfigs', error);
            return '-';
        });
    }
    return orderId;
}
