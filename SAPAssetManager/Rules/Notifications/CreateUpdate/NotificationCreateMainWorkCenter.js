import libNotif from '../NotificationLibrary';

export default function NotificationCreateMainWorkCenter(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return context.binding.InspectionPoint_Nav.WOOperation_Nav.WorkCenterInternalId;
    } else {
        return libNotif.NotificationCreateMainWorkCenter(context);
    }
}
