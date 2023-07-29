import libComm from './Common/Library/CommonLibrary';
import WorkOrderEnableMobileStatus from './WorkOrders/MobileStatus/WorkOrderEnableMobileStatus';
import NotificationEnableMobileStatus from './Notifications/MobileStatus/NotificationEnableMobileStatus';
import MobileStatusLibrary from './MobileStatus/MobileStatusLibrary';
import IsPhaseModelEnabled from './Common/IsPhaseModelEnabled';
import libSup from './Supervisor/SupervisorLibrary';
import isSupervisorFeatureEnabled from './Supervisor/isSupervisorFeatureEnabled';
import libPersona from './Persona/PersonaLibrary';
import EnableWorkOrderCreate from './UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import { WorkOrderLibrary as libWO } from './WorkOrders/WorkOrderLibrary';

export default function ContextMenuLeadingItems(context) {

    // Declare mobile statuses as rule-scoped constants
    const RECEIVED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const STARTED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const SUCCESS = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
    const ACCEPTED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
    const TRAVEL = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
    const ONSITE = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
    const WORKCOMPLETED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WorkCompletedParameterName.global').getValue();

    // Helper function: determine items to show for Notification context menu
    let notificationStartComplete = function() {
        return NotificationEnableMobileStatus(context).then(enabled => {
            let leadingItems = [];
            if (enabled) {
                leadingItems.push('Add_Item');
                if (MobileStatusLibrary.getMobileStatus(context.binding, context) === STARTED) {
                    if (IsPhaseModelEnabled(context)) {
                        leadingItems.unshift('End_Notification');
                    } else {
                        // Get number of Items with unfinished Item Tasks. If zero, return true
                        let allItemTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Items`, `$filter=ItemTasks/any(itmTask : itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${COMPLETED}' and itmTask/ItemTaskMobileStatus_Nav/MobileStatus ne '${SUCCESS}')`).then(count => {
                            return count === 0;
                        });
                        // Get number of unfinished Tasks. If zero, return true
                        let allTasksComplete = context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Tasks`, `$filter=TaskMobileStatus_Nav/MobileStatus ne '${COMPLETED}' and TaskMobileStatus_Nav/MobileStatus ne '${SUCCESS}'`).then(count => {
                            return count === 0;
                        });

                        return Promise.all([allItemTasksComplete, allTasksComplete]).then(results => {
                            if (results[0] && results[1]) {
                                leadingItems.unshift('End_Notification');
                            }
                            return leadingItems;
                        });
                    }
                } else if (MobileStatusLibrary.getMobileStatus(context.binding, context) === RECEIVED) {
                    leadingItems.unshift('Start_Notification');
                }
            }
            return leadingItems;
        });
    };

    // Helper function: determine items to show for Work Order context menu
    let orderStartComplete = function() {
        let enableMobileStatusChange = WorkOrderEnableMobileStatus(context);
        const isWCMWorkOrder = libWO.isWCMWorkOrder(context);
        let enableMobileStatusStart = libComm.getStateVariable(context, 'isAnyWorkOrderStarted');

        return Promise.all([enableMobileStatusChange, enableMobileStatusStart]).then(params => {
            const enableStatusChange = params[0];
            const enableStart = !params[1];
            const mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
            if (enableStatusChange) {
                if (enableStart && (mobileStatus === RECEIVED || mobileStatus === HOLD))
                    return ['Start_WorkOrder', 'Transfer_WorkOrder'];
                else if (mobileStatus === STARTED) {
                    const statuses = ['Hold_WorkOrder'];
                    return libSup.checkReviewRequired(context, context.binding).then((result) => {
                        if (result)
                            statuses.push('Review_WorkOrder');
                        else if (!isWCMWorkOrder)
                            statuses.push('Complete_WorkOrder');
                        else if (isWCMWorkOrder && libPersona.isMaintenanceTechnician(context))
                            statuses.push('Work_Completed');    
                        return statuses;
                    });
                } else if (mobileStatus === WORKCOMPLETED) {
                    return ['Complete_WorkOrder'];
                } else {
                    return ['Transfer_WorkOrder'];
                }
            } else {
                if (mobileStatus !== COMPLETED)
                    return ['Add_Notification'];
                else
                    return [];
            }
        });
    };

    // Helper function: determine items to show for Operation context menu
    let operationConfirmUnconfirm = function() {
        if (context.binding.WOHeader.OrderMobileStatus_Nav.MobileStatus === COMPLETED) {
            return Promise.resolve([]);
        } else {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Confirmations`, [], '$orderby=ConfirmationCounter desc&$top=1').then(result => {
                return result.length > 0 && result.getItem(0).FinalConfirmation === 'X';
            }).then(confirmed => {
                if (context.binding.WOHeader.OrderMobileStatus_Nav.MobileStatus === STARTED) {
                    return [confirmed ? 'Unconfirm_Operation' : 'Confirm_Operation', 'Add_Notification'];
                } else if (context.binding.WOHeader.OrderMobileStatus_Nav.MobileStatus !== COMPLETED) {
                    return ['Add_Notification'];
                } else {
                    return [];
                }
            });
        }
    };

    // Helper function: determine items to show for Suboperation context menu
    let suboperationConfirmUnconfirm = function() {
        if (context.binding.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav.MobileStatus === COMPLETED) {
            return Promise.resolve([]);
        } else {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Confirmations`, [], '$orderby=ConfirmationCounter desc&$top=1').then(result => {
                return result.length > 0 && result.getItem(0).FinalConfirmation === 'X';
            }).then(confirmed => {
                if (context.binding.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav.MobileStatus === STARTED) {
                    return [confirmed ? 'Unconfirm_Suboperation' : 'Confirm_Suboperation', 'Add_Notification'];
                } else if (context.binding.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav.MobileStatus !== COMPLETED) {
                    return ['Add_Notification'];
                } else {
                    return [];
                }
            });
        }
    };

    // Rule logic begins here //
    let leading = [];
    let entityType = context.binding['@odata.type'];
    let assignmentType = libComm.getWorkOrderAssnTypeLevel(context);
    return EnableWorkOrderCreate(context).then(enableResult => {
        switch (entityType) {
            case '#sap_mobile.MyWorkOrderHeader':
                if (isSupervisorFeatureEnabled(context) ) {
                    return leading; //Requires redesign for 2310
                }
                if (assignmentType === 'Header') {
                    leading = orderStartComplete();
                }
                if (assignmentType === 'Operation' || assignmentType === 'SubOperation') {
                    return ['Add_Notification'];
                }
                break;
            case '#sap_mobile.MyWorkOrderOperation':
                if (isSupervisorFeatureEnabled(context)) { //As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2310
                    return leading;
                }
                if (assignmentType === 'Operation') {
                    let mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus; 
                    let isAnyOperationStarted = libComm.getStateVariable(context, 'isAnyOperationStarted');
                    if (libPersona.isMaintenanceTechnician(context)) {
                        if (mobileStatus === RECEIVED || mobileStatus === HOLD) {
                            leading = Promise.resolve(isAnyOperationStarted ? ['Transfer_Operation'] : ['Start_Operation', 'Transfer_Operation']);
                        } else if (mobileStatus === STARTED) {
                            leading = Promise.resolve(['Hold_Operation', 'Complete_Operation']);
                        } else {
                            leading = Promise.resolve(['Add_Notification']);
                        }
                    } else if (libPersona.isFieldServiceTechnician(context)) {
                        if (mobileStatus === RECEIVED) {
                            leading = Promise.resolve(['Accept_Operation', 'Reject_Operation', 'Transfer_Operation']);
                        } else if (mobileStatus === ACCEPTED || mobileStatus === ONSITE) {
                            leading = Promise.resolve(isAnyOperationStarted ? ['Travel_to_Destination'] : ['Travel_to_Destination', 'Start_Operation']);
                        } else if (mobileStatus === HOLD) {
                            leading = Promise.resolve(isAnyOperationStarted ? ['Travel_to_Destination', 'Transfer_Operation'] : ['Travel_to_Destination', 'Start_Operation', 'Transfer_Operation']);
                        } else if (mobileStatus === TRAVEL) {
                            leading = Promise.resolve(['Arrive_at_Destination']);
                        } else if (mobileStatus === STARTED) {
                            leading = Promise.resolve(['Hold_Operation', 'Complete_Operation']);
                        } else {
                            leading = Promise.resolve(['Add_Notification']);
                        }
                    }
                }
                if (assignmentType === 'Header' || assignmentType === 'SubOperation') {
                    leading = operationConfirmUnconfirm();
                }
                break;
            case '#sap_mobile.MyWorkOrderSubOperation':
                if (assignmentType === 'SubOperation') {
                    let mobileStatus = context.binding.SubOpMobileStatus_Nav.MobileStatus; 
                    let isAnySubOperationStarted = libComm.getStateVariable(context, 'isAnySubOperationStarted');
                    if (libPersona.isMaintenanceTechnician(context)) {
                        if (mobileStatus === RECEIVED || mobileStatus === HOLD) {
                            leading = Promise.resolve(isAnySubOperationStarted ? ['Transfer_Suboperation'] : ['Start_Suboperation', 'Transfer_Suboperation']);
                        } else if (mobileStatus === STARTED) {
                            leading = Promise.resolve(['Hold_Suboperation', 'Complete_Suboperation']);
                        } else {
                            leading = Promise.resolve(['Add_Notification']);
                        }
                    } else if (libPersona.isFieldServiceTechnician(context)) {
                        if (mobileStatus === RECEIVED) {
                            leading = Promise.resolve(['Accept_Suboperation', 'Reject_Suboperation']);
                        } if (mobileStatus === ACCEPTED || mobileStatus === HOLD || mobileStatus === ONSITE) {
                            leading = Promise.resolve(isAnySubOperationStarted ? ['Travel_to_Destination'] : ['Start_Suboperation', 'Travel_to_Destination']);
                        } else if (mobileStatus === STARTED) {
                            leading = Promise.resolve(['Hold_Suboperation', 'Complete_Suboperation']);
                        } else if (mobileStatus === TRAVEL) {
                            leading = Promise.resolve(['Arrive_at_Destination']);
                        } else {
                            leading = Promise.resolve(['Add_Notification']);
                        }
                    }
                } else {
                    leading = suboperationConfirmUnconfirm();
                }
                break;
            case '#sap_mobile.MyNotificationHeader':
                leading = notificationStartComplete();
                break;
            case '#sap_mobile.MyFunctionalLocation':
                if (enableResult) {
                    leading = Promise.resolve(['Add_NotificationFromFloc', 'Add_WorkOrderFromFloc']);
                } else {
                    leading = Promise.resolve(['Add_NotificationFromFloc']);
                }
                break;
            case '#sap_mobile.MyEquipment':
                if (enableResult) {
                    leading = Promise.resolve(['Add_NotificationFromEquipment', 'Add_WorkOrderFromEquipment']);
                } else {
                    leading = Promise.resolve(['Add_NotificationFromEquipment']);
                }
                break;
            case '#sap_mobile.CatsTimesheetOverviewRows':
                leading = Promise.resolve(['Delete_Timesheet']);
                break;
            case '#sap_mobile.Confirmations':
                leading = Promise.resolve(['Delete_Confirmation']);
                break;
            case '#sap_mobile.MyFuncLocDocuments':
                break;
            case '#sap_mobile.MyNotifDocuments':
                break;
            case '#sap_mobile.MyEquipDocuments':
                break;
            case '#sap_mobile.MyWorkOrderDocuments':
                break;
            case '#sap_mobile.Documents':
                break;
            case '#sap_mobile.MeasurementDocuments':
                leading = Promise.resolve(['Delete_MeasurementDocument']);
                break;
            default:
                break;
        }
        return leading;
    });
}
