import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OperationReAssignChangeSet(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        let employeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
        if (employeeTo === context.getClientData().PreviousEmployeeTo) {
            context.getClientData().Error=context.localizeText('already_assign_message', [context.getClientData().PreviousEmployeeName]);
            return context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
        }
        //unassign && assign
        if (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) || !(context.binding.PersonNum === '00000000')) {
            context.getClientData().OrderId = context.binding.OrderId;
            context.getClientData().OperationNo = context.binding.OperationNo;
            context.getClientData().EmployeeFrom = '';
            context.getClientData().EmployeeTo = context.evaluateTargetPath('#Control:AssignToLstPkr/#Value')[0].ReturnValue;
            context.getClientData().HeaderNotes = context.evaluateTargetPath('#Control:TransferNote/#Value');
            context.getClientData().ObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
            context.getClientData().ObjectKey = context.binding.OperationMobileStatus_Nav.ObjectKey;
            context.getClientData().MobileStatusReadLink = context.binding.OperationMobileStatus_Nav['@odata.readLink'];
            context.getClientData().OperationReadLink = context.binding['@odata.readLink'];
            context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().PreviousEmployeeTo}')`;
            context.getClientData().Ignore = 'false';
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderTransfers', [], `$filter=OrderId eq '${context.binding.OrderId}' and OperationNo eq '${context.binding.OperationNo}' and EmployeeTo eq '${context.getClientData().PreviousEmployeeTo}' and sap.islocal()`).then(function(results) {
                if (results && results.length > 0) {
                    context.getClientData().TransferReadLink = results.getItem(0)['@odata.readLink'];
                    return context.executeAction('/SAPAssetManager/Actions/Supervisor/UnAssign/WorkOrderUnAssignPerson.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderOrOperationTransferAssignPerson.action').then(() => {
                            context.getClientData().EmployeeReadLink = `Employees('${context.getClientData().EmployeeTo}')`;
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationUpdatePersonUpdateLink.action').then(() => {
                                return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignSuccessMessage.action');
                            });
                        });
                    });
                }
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
            });
        }
    }
}
