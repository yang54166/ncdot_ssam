import mobileStatusOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import common from '../../Common/Library/CommonLibrary';
import libOpMobile from './OperationMobileStatusLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import isAssignEnableWorkOrderOperation from './IsAssignEnableWorkOrderOperation';
import isUnAssignEnableWorkOrderOperation from './IsUnAssignEnableWorkOrderOperation';
import personaLib from '../../Persona/PersonaLibrary';
import Logger from '../../Log/Logger';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function OperationChangeStatusOptions(context) {
    const READY = 'READY'; // Don't bother adding this to the config panel. EAM Team needs to fix their hardcoded app transitions first. See TODO below.
    const RECEIVED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const REJECTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    const APPROVE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    const DISAPPROVE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    const cicoEnabled = libClock.isCICOEnabled(context);

    /**
     * Checks for supervisor feature enablement and returns role if applicable
     * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
     */
     let roleCheck = function() {
        const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);

        if (supervisorEnabled) {
            return libSuper.isUserTechnician(context).then(isTechnician => {
                if (isTechnician) {
                    return 'T';
                }
                return 'S';
            });
        } else {
            // Supervisor isn't enabled
            return Promise.resolve('S');
        }
    };

    const assnType = common.getWorkOrderAssignmentType(context);
    // If header level assignment, only allow confirm/unconfirm. Otherwise, do the whole mobile status shebang.
    if (assnType === '1' || assnType === '5' || assnType === '7' || assnType === '8') {
        let workOrderMobileStatus = MobileStatusLibrary.getMobileStatus(context.binding.WOHeader, context);
        if (workOrderMobileStatus === STARTED) {
            return MobileStatusLibrary.isMobileStatusConfirmed(context).then(result => {
                if (result) {
                    return [{'Title': context.localizeText('unconfirm'), 'OnPress': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationUnconfirmStatus.js'}];
                } else {
                    return [{'Title': context.localizeText('confirm'), 'OnPress': '/SAPAssetManager/Rules/Operations/MobileStatus/OperationConfirmStatus.js'}];
                }
            });
        }
        context.dismissActivityIndicator();
        return Promise.resolve([]);
    } else {
        return Promise.all([libOpMobile.isAnyOperationStarted(context), roleCheck(), PhaseLibrary.isPhaseModelActiveInDataObject(context, context.binding)]).then(async checks => {
            const anythingStarted = checks[0];
            const userRoleType = checks[1];
            const isPhaseModelActiveInDataObject = checks[2];

            // Return empty list for Operations without mobile status
            if (libVal.evalIsEmpty(context.binding.OperationMobileStatus_Nav)) {
                return Promise.resolve([]);
            }

            let orderEAMStatusProfile = '';

            if (IsPhaseModelEnabled(context) && context.binding.WOHeader && context.binding.WOHeader.OrderType) {
                orderEAMStatusProfile = await context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['EAMOverallStatusProfile'], `$filter=OrderType eq '${context.binding.WOHeader.OrderType}'`).then(orderTypeArray => {
                    if (orderTypeArray.length > 0) {
                        return orderTypeArray.getItem(0).EAMOverallStatusProfile;
                    }
                    return '';
                });
            }

            const mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
            const statusIsLocal = context.binding.OperationMobileStatus_Nav['@sap.isLocal'];
            const isClockedIn = (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus));
            let entitySet = context.binding['@odata.readLink'] + '/OperationMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
            //hlf -- change query option to NextOverallStatusCfg_Nav/EAMOverallStatusProfile
           // let queryOptions = `$expand=NextOverallStatusCfg_Nav&$filter=UserPersona eq '${personaLib.getActivePersona(context)}' and ToEAMOverallStatusProfile eq '${orderEAMStatusProfile}'`;
            let queryOptions = `$expand=NextOverallStatusCfg_Nav&$filter=UserPersona eq '${personaLib.getActivePersona(context)}' and NextOverallStatusCfg_Nav/EAMOverallStatusProfile eq '${orderEAMStatusProfile}'`;

            if (isClockedIn && mobileStatus !== STARTED) { //User is clocked in, but mobile status is not STARTED because another user has changed it.  We will use the next available statuses for STARTED
                entitySet = 'EAMOverallStatusSeqs';
                queryOptions += " and OverallStatusCfg_Nav/MobileStatus eq 'STARTED' and OverallStatusCfg_Nav/ObjectType eq 'WO_OPERATION'";
            }

            // If CICO enabled, current Operation is started, and this object is not clocked in, do not transition; clock in immediately
            if (!anythingStarted && mobileStatus === STARTED && (cicoEnabled && !isClockedIn)) {
                return [{'Title': context.localizeText('clock_in'), 'OnPress': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationDummyStatusToast.action'}];
            } else {
                return libSuper.checkReviewRequired(context, context.binding).then(review => {
                    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/OperationMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
                        common.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0)); //Save the rollback state to use if necessary


                        let phaseModelCheck = (() => {
                            if (IsPhaseModelEnabled(context)) {
                                // Phase model is enabled. See if any active phase controls exist
                                return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/PhaseControl_Nav`, [], "$filter=IsActive eq 'X' and ProcessSubphase ne '' and ProcessPhase ne ''").then(result => {
                                    return result._array;
                                });
                            } else {
                                // Return empty array of phase controls so nothing is blocked
                                return Promise.resolve([]);
                            }
                        })();

                        return phaseModelCheck.then(stopKeys => {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
                                let popoverItems = [];

                                // Go through each available next status and create a PopoverItems array
                                codes.forEach(element => {
                                    let statusElement = element.NextOverallStatusCfg_Nav;
                                    if (statusElement) {
                                        let transitionText;

                                        // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                                        if (statusElement.TransitionTextKey) {
                                            if (cicoEnabled && statusElement.MobileStatus === STARTED) {
                                                transitionText = context.localizeText('clock_in');
                                            } else {
                                                transitionText = context.localizeText(statusElement.TransitionTextKey);
                                            }
                                        } else {
                                            transitionText = statusElement.OverallStatusLabel;
                                        }

                                        // Check for Phase Control Statuses. If one is found for the current transition, preempt it here
                                        if (element.RoleType === userRoleType && stopKeys.findIndex(stopKey => stopKey.ProcessPhase === statusElement.Phase && stopKey.ProcessSubphase === statusElement.Subphase) !== -1) {
                                            popoverItems.push({ 'Title': transitionText, 'OnPress': {'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': {
                                                'Title': context.localizeText('transition_blocked'),
                                                'Message': context.localizeText('transition_blocked_msg'),
                                                'OKCaption': context.localizeText('ok'),
                                            }}});
                                        } else {
                                            // Add items to possible transitions list
                                            if (statusElement.OverallStatusLabel && statusElement.OverallStatusLabel.toLowerCase() === 'transfer'
                                                && (assnType === '4' || assnType === 'A')) {
                                                Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMobileStatus.global').getValue(), 'Assignment type is 4, trasfer is not supported.');
                                            } else if (statusElement.MobileStatus === APPROVE && element.RoleType === userRoleType) {
                                                let postUpdateRule;
                                                if (libSuper.isAutoCompleteOnApprovalEnabled(context)) {
                                                    WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(context, true);
                                                    postUpdateRule = '/SAPAssetManager/Rules/Supervisor/ApprovalPostUpdate.js';
                                                } else {
                                                    postUpdateRule = '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js';
                                                }
                                                popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', postUpdateRule)});
                                            } else if (statusElement.MobileStatus === DISAPPROVE && element.RoleType === userRoleType) {
                                                common.setStateVariable(context, 'PhaseModelStatusElement', statusElement);
                                                popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js'});
                                            } else if (statusElement.MobileStatus === REJECTED && personaLib.isFieldServiceTechnician(context)) {
                                                common.setStateVariable(context, 'RejectStatusElement', statusElement);
                                                common.setStateVariable(context, 'IsOnRejectOperation', true);
                                                popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/MobileStatus/OperationRejectCreateRejectReasonNav.js'}); // add reject reason as a note
                                            } else if (statusElement.MobileStatus === REVIEW && element.RoleType === userRoleType) {
                                                if (review) { //Review required for tech
                                                    popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/NavOnCompleteOperationPage.js'});
                                                }
                                            } else if (statusElement.MobileStatus === COMPLETE && element.RoleType === userRoleType && mobileStatus !== REVIEW) {
                                                let isCompleteVisible = (!userRoleType || userRoleType === 'S' || (userRoleType === 'T' && !review)); //Allow complete if not using supervisor feature or supervisor or if technician and WO does not require review
                                                if (libSuper.isSupervisorFeatureEnabled(context) && userRoleType === 'S' && mobileStatus === DISAPPROVE && !statusIsLocal) {
                                                    isCompleteVisible = false; //Supervisor can only transition from DISAPPROVE to COMPLETE if status change is local
                                                }
                                                if (isCompleteVisible) {
                                                    popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/NavOnCompleteOperationPage.js'});
                                                }
                                            } else if (statusElement.MobileStatus === TRANSFER && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context) || !libSuper.isSupervisorFeatureEnabled(context))) {
                                                // Prepend warning dialog to transfer status change
                                                popoverItems.push({'Title': transitionText, 'OnPress': {
                                                    'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                                                    'Properties': {
                                                        'Title': context.localizeText('confirm_status_change'),
                                                        'Message': context.localizeText('transfer_operation_warning_message'),
                                                        'OKCaption': context.localizeText('ok'),
                                                        'CancelCaption': context.localizeText('cancel'),
                                                        'OnOK': '/SAPAssetManager/Actions/WorkOrders/Operations/OperationTransferNav.action',
                                                    },
                                                }});
                                            } else {
                                                // Add all other items to possible transitions as-is
                                                // Omit Started if other work orders have been started
                                                // Omit statuses not relevant to current role

                                                // TODO: EAM Team currently has status changes hardcoded in "Perform Maintenance Jobs" app. Remove hardcoded conditionals once this changes.
                                                // Original code:
                                                // if (!(statusElement.MobileStatus === STARTED && anythingStarted) && element.RoleType === supervisorRole) {
                                                //     popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav')});
                                                // } else {
                                                //     // Do nothing
                                                // }
                                                if (isPhaseModelActiveInDataObject) {
                                                    if (((mobileStatus === READY && statusElement.MobileStatus === STARTED && !anythingStarted) ||
                                                        (mobileStatus === STARTED && statusElement.MobileStatus === HOLD) ||
                                                        (mobileStatus === HOLD && statusElement.MobileStatus === STARTED && !anythingStarted) ||
                                                        (mobileStatus === RECEIVED && statusElement.MobileStatus === STARTED && !anythingStarted)) && element.RoleType === userRoleType) {
                                                        popoverItems.push({ 'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js') });
                                                    }

                                                    if (mobileStatus === STARTED && statusElement.MobileStatus === COMPLETE && element.RoleType === userRoleType) {
                                                        popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/NavOnCompleteOperationPage.js'});
                                                    }

                                                    if ((statusElement.MobileStatus === APPROVE || statusElement.MobileStatus === DISAPPROVE)
                                                        && userRoleType === 'S') {
                                                        popoverItems.push({ 'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav') });
                                                    }
                                                } else if (!(statusElement.MobileStatus === STARTED && anythingStarted) && element.RoleType === userRoleType
                                                    && statusElement.MobileStatus !== APPROVE
                                                    && statusElement.MobileStatus !== DISAPPROVE) {
                                                    popoverItems.push({ 'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js') });
                                                } else if (personaLib.isFieldServiceTechnician(context) && statusElement.MobileStatus === COMPLETE) {
                                                    popoverItems.push({ 'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/Operations/NavOnCompleteOperationPage.js'});
                                                } else if (personaLib.isFieldServiceTechnician(context) && !(statusElement.MobileStatus === STARTED && anythingStarted)) {
                                                    popoverItems.push({ 'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OperationMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/OperationMobileStatusPostUpdate.js') });
                                                }
                                            }
                                        }
                                    }
                                });

                                if (mobileStatus !== STARTED) { //Add supervisor role assignment options only if the operation is not started (These are not data driven currently)
                                    return Promise.all([isAssignEnableWorkOrderOperation(context), isUnAssignEnableWorkOrderOperation(context)]).then(assignResults => {
                                        const assign = assignResults[0];
                                        const unassign = assignResults[1];

                                        if (assign) {
                                            popoverItems.push({'Title': context.localizeText('assign'), 'OnPress': '/SAPAssetManager/Rules/Supervisor/Assign/OperationAssignNav.js'});
                                        }
                                        if (unassign) {
                                            popoverItems.push({'Title': context.localizeText('unassign'), 'OnPress': '/SAPAssetManager/Rules/Supervisor/UnAssign/OperationUnAssignNav.js'});
                                            popoverItems.push({'Title': context.localizeText('reassign'), 'OnPress': '/SAPAssetManager/Rules/Supervisor/ReAssign/OperationReAssignNav.js'});
                                        }

                                        return popoverItems;
                                    });
                                } else {
                                    return Promise.resolve(popoverItems);
                                }

                            });
                        });
                    });
                });
            }
        });
    }
}
