import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function MeterReadingCreateEntitySet(context) {
    let readingObj = libCom.getStateVariable(context, 'METERREADINGOBJ') || context.binding;
    if (!readingObj.DeviceLink) {
        readingObj.DeviceLink = readingObj.Device_Nav;
    }
    let device = readingObj.DeviceLink.Device;
    if (!libVal.evalIsEmpty(device)) {
        return device;
    } else {
        return '';
    }
}
