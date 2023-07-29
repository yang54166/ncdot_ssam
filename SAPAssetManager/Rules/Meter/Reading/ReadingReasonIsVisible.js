import libMeter from '../Common/MeterLibrary';

export default function ReadingReasonIsVisible(context) {
    return libMeter.getMeterTransactionType(context) === 'READING';
}
