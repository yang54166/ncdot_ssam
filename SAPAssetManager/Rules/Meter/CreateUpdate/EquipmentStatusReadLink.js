import libMeter from '../Common/MeterLibrary';

export default function EquipmentStatusReadLink(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return "SystemStatuses('I0100')";
    } else if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE') {
        return "SystemStatuses('LOC01')";
    }
    return '';
}
