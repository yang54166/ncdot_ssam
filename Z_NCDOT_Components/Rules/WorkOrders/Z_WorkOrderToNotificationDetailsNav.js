import pageToolbar from '../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import NotificationChangeStatusOptions from '../../../SAPAssetManager/Rules/Notifications/MobileStatus/NotificationChangeStatusOptions';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';

export default function Z_WorkOrderToNotificationDetailsNav(context) {
    const navAction = '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action';
    let pageProxy = context.getPageProxy();
    const bindingOriginal = pageProxy.binding;
    
    if (pageProxy.binding.NotificationNumber){
        let notification = "MyNotificationHeaders('" + pageProxy.binding.NotificationNumber + "')"
        return  context.read('/SAPAssetManager/Services/AssetManager.service',notification,[],'$expand=NotifMobileStatus_Nav').then(noti => {
            if (noti){
                pageProxy._context.binding = noti.getItem(0);
                return preparetoNavigateToNoti(context, pageProxy,bindingOriginal,navAction,noti.getItem(0))
            }
        });
    }
    return false;
}

function preparetoNavigateToNoti(context, pageProxy, bindingOriginal, navAction,noti) {
    
    return NotificationChangeStatusOptions(pageProxy).then(items => {
        pageProxy._context.binding = bindingOriginal; // revert to original binding 
        return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'NotificationDetailsPage').then(() => {
            context.getPageProxy().setActionBinding(noti) ;
            return context.executeAction(navAction);
        });
    }).catch(error => {
        pageProxy._context.binding = bindingOriginal;
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
        return pageProxy.executeAction(navAction);
    });
}
