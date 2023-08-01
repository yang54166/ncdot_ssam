import CommonLibrary from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NotificationsListViewNav(context) {
    libCom.setStateVariable(context,'FromOperationsAssignedList', false);
    CommonLibrary.setStateVariable(context, 'OnFollowOnNotificationsList', false);
    return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action');
}
