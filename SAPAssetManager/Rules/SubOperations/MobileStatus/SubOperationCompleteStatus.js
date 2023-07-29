import libSubOprMobile from './SubOperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function SubOperationCompleteStatus(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));

    //Save the sub-operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCommon.setBindingObject(context);

    //Set ChangeStatus property to 'Completed'.
    //ChangeStatus is used by SubOperationMobileStatusFailureMessage.action & SubOperationMobileStatusSuccessMessage.action
    context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    context.showActivityIndicator('');
    return libSubOprMobile.completeSubOperation(context).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
        delete context.getPageProxy().getClientData().ChangeStatus;
        context.getPageProxy().getClientData().didShowSignControl = false; 
    });
}
