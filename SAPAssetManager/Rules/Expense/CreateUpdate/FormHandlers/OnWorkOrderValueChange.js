import libCom from '../../../Common/Library/CommonLibrary';
import libEval from '../../../Common/Library/ValidationLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import MileageAddEditOperationQueryOptionsQueryBuilder from '../../../ServiceOrders/Mileage/MileageAddEditOperationQueryOptionsQueryBuilder';

export default function OnWorkOrderValueChange(workOrderControl) {
    ResetValidationOnInput(workOrderControl);
    let pageProxy = workOrderControl.getPageProxy();
    let orderId = workOrderControl.getValue()[0] ? workOrderControl.getValue()[0].ReturnValue : '';
    let operationListPicker = libCom.getControlProxy(pageProxy, 'OperationLstPkr');
    pageProxy.getClientData().currentObject.OrderId = orderId;

    if (libEval.evalIsEmpty(orderId)) {
        operationListPicker.setValue('');
        libCom.setFormcellNonEditable(operationListPicker);
    } else {
        libCom.setFormcellEditable(operationListPicker);

        setCurrency(pageProxy, orderId);
        return updateOperationQueryOptions(operationListPicker, workOrderControl, orderId).then(options => {
            return updateWorkCenter(pageProxy, options);
        });
    }
}

export function setCurrency(context, orderId) {
    let currencyControl = context.getControl('FormCellContainer').getControl('CurrencyProperty');
    context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${orderId}')`, [], '').then(result => {
        let currency;
        if (result && result.length) {
            currency = result.getItem(0).OrderCurrency;
        }

        if (!currency) {
            currency = context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/ExpenseDefaultCurrency.global').getValue();
        }

        currencyControl.setValue(currency);
    });
}

function updateOperationQueryOptions(operationControl, workOrderControl, orderId) {
    return MileageAddEditOperationQueryOptionsQueryBuilder(workOrderControl, orderId).then(options => {
        let target = operationControl.getTargetSpecifier();
        target.setQueryOptions(options);
        operationControl.setTargetSpecifier(target);
        return options;
    });
    
}

function updateWorkCenter(pageProxy, options) {
    let workCenterPicker = libCom.getControlProxy(pageProxy,'WorkCenterPicker');
    let isMileage = pageProxy.getControl('FormCellContainer').getControl('OrderLstPkr');

    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', ['MainWorkCenter'], options).then(results => {
        if (results && results.length === 1) {
            let defaultWorkCenter = isMileage ?
                libCom.getMileageWorkCenter(pageProxy) : libCom.getExpenseWorkCenter(pageProxy);
            if (defaultWorkCenter) {
                workCenterPicker.setEditable(true);
                workCenterPicker.setValue(defaultWorkCenter);
                return Promise.resolve();
            }
        
            let operationRecord = results.getItem(0);
            let mainWorkCenter = operationRecord.MainWorkCenter;

            if (mainWorkCenter) {
                workCenterPicker.setEditable(true);
                workCenterPicker.setValue(mainWorkCenter);
            }
        } else {
            workCenterPicker.setEditable(false);
            workCenterPicker.setValue('');
        }

        return Promise.resolve();
    });
}
