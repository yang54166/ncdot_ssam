import OperationChangeStatusOptions from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationChangeStatusOptions';
import pageToolbar from '../../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';

export default function Z_WorkOrderOperationDetailsNav(context) {
    
    // let previousPageProxy;
    // let actionBinding;
    // let beforePreviousPageProxy;
    let pageProxy = context.getPageProxy();
    const bindingOriginal = pageProxy.binding;

    // try {
    //     actionBinding = pageProxy.getActionBinding();
    //     previousPageProxy = pageProxy.evaluateTargetPathForAPI('#Page:-Previous');
    //     beforePreviousPageProxy = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
    // } catch (err) {
    //     return generateStatusItemsAndNavigate(pageProxy);
    // }

    let user = libCom.getSapUserName(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', `PMMobileStatuses`, [], `$filter=ObjectType eq 'OVG' and CreateUserId eq '${user}' and MobileStatus eq 'STARTED' `)
        .then(status => {
            if (status.length > 0){
                let statusOP = status.getItem(0);
                let op = `MyWorkOrderOperations(OrderId='` + statusOP.OrderId +   `',OperationNo='` + statusOP.OperationNo + `')`;
                return context.read('/SAPAssetManager/Services/AssetManager.service', op,[],'$expand=WOHeader,OperationMobileStatus_Nav').then (op => {
                    pageProxy._context.binding = op.getItem(0);
                    return generateStatusItemsAndNavigate(context,pageProxy,bindingOriginal,op.getItem(0));
                })
            }
            return '';
    });

    
}

function generateStatusItemsAndNavigate(context,pageProxy,bindingOriginal,op) {
    //let bindingOriginal = pageProxy.binding;
    const navAction = '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action';
    pageProxy._context.binding = op;
    return OperationChangeStatusOptions(pageProxy).then(items => {
        pageProxy._context.binding = bindingOriginal; // revert to original binding 
        return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'WorkOrderOperationDetailsPage').then(() => {
            context.getPageProxy().setActionBinding(op) ;
            return context.executeAction(navAction);
        });
    }).catch(error => {
        pageProxy._context.binding = bindingOriginal;
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
        return pageProxy.executeAction(navAction);
    });
}
