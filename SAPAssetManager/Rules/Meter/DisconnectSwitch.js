import libMeter from './Common/MeterLibrary';

export default function DisconnectSwitch(context) {
    if (libMeter.getMeterTransactionType(context) === 'DISCONNECT') {
        return context.executeAction('/SAPAssetManager/Actions/Meters/DisconnectMeterChangeSet.action');
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Meters/ReconnectMeterChangeSet.action');
    }
}
