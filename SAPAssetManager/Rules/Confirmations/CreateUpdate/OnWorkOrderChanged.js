import libCom from '../../Common/Library/CommonLibrary';
import operationQueryOptions from './OperationPickerQueryOptions';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import OnOperationChangeListPickerUpdate, {redrawListControl} from './OnOperationChangeListPickerUpdate';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function OnWorkOrderChanged(context) {
    let binding = context.getBindingObject();
    let orderId = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let pageProxy = context.getPageProxy();
    let finalControl = libCom.getControlProxy(pageProxy, 'IsFinalConfirmation');
    
    let woLstPicker = libCom.getControlProxy(pageProxy, 'WorkOrderLstPkr');
    /* Clear the validation if the field is not empty */
    ResetValidationOnInput(woLstPicker);

    if (orderId.length === 0) {
        if (binding.IsFinalChangable) { //Allow changing is final since no work order selected
            finalControl.setEditable(true);
        }
        //Unselected, clear dependent controls
        return onNoWorkOrder(pageProxy);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=OrderMobileStatus_Nav&$filter=OrderId eq '${orderId}'&$top=1`).then(result => {
        if (!result || result.length === 0) {
            return onNoWorkOrder(pageProxy);
        }
        let workOrder = result.getItem(0);
        return libSuper.checkReviewRequired(context, workOrder).then(review => {
            if (review && !libMobile.isSubOperationStatusChangeable(context)) { //If not sub-operation assignment and needs review, then don't allow final confirmation to be set by user
                finalControl.setValue(false);    
                finalControl.setEditable(false);
            } else if (binding && binding.IsFinalChangable) {
                finalControl.setEditable(true);
            }
            return onWorkOrderReceived(pageProxy, orderId);
        });
    });
}

//Work order selected, so populate and enable the operation picker and other dependent pickers
function onWorkOrderReceived(pageProxy, orderTemp) {    
    return Promise.all([operationQueryOptions(pageProxy, orderTemp)]).then(function(operationResult) {
        let binding = pageProxy.binding || {};
        return pageProxy.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderOperations', operationResult[0]).then(count => {
            let clearOperationValue = !orderTemp || orderTemp !== binding.OrderID;
            if (count === 1) clearOperationValue = false; //Do not reset if only one operation for this WO to allow picker to auto-select the entry
            return redrawListControl(pageProxy, 'OperationPkr', operationResult[0], binding.IsOnCreate, clearOperationValue).then(() => {
                return OnOperationChangeListPickerUpdate(pageProxy).then(() => {
                    pageProxy.getControl('FormCellContainer').redraw();
                });
            });
        });
    });
}

//No work order, so blankout and disable dependent pickers
function onNoWorkOrder(pageProxy) {    
    redrawListControl(pageProxy, 'OperationPkr', '', false, true);
    redrawListControl(pageProxy, 'SubOperationPkr', '', false, true);
    redrawListControl(pageProxy, 'ActivityTypePkr', '', false, true);
    redrawListControl(pageProxy, 'VarianceReasonPkr', '', false, true);
    pageProxy.getControl('FormCellContainer').redraw();
    return Promise.resolve(true);
}
