/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function Z_DisplayZCARNotificationNotes(clientAPI) {
    return clientAPI.binding.WOHeader.Notification.HeaderLongText[0].TextString;
}
