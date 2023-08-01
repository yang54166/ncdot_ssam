import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import assnType from '../../../../SAPAssetManager/Rules/Common/Library/AssignmentType';
import lamCopy from '../../../../SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateLAMCopy';

export default function Z_WorkOrderCreateFromLemurNav(clientAPI, bindingParams) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(clientAPI, true);
    libCommon.setOnWOChangesetFlag(clientAPI, true);
    libCommon.resetChangeSetActionCounter(clientAPI);

    libCommon.removeStateVariable(clientAPI, 'WODefaultPlanningPlant');
    libCommon.removeStateVariable(clientAPI, 'WODefaultWorkCenterPlant');
    libCommon.removeStateVariable(clientAPI, 'WODefaultMainWorkCenter');

    let binding = clientAPI.binding;

    let actionBinding = {
        PlanningPlant: assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant'),
        OrderType: libCommon.getAppParam(clientAPI, 'WORKORDER', 'OrderType'),
        Priority: libCommon.getAppParam(clientAPI, 'WORKORDER', 'Priority'),
    };
   
        actionBinding.MainWorkCenterPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'WorkCenterPlant');
        actionBinding.MainWorkCenter = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'MainWorkCenter');

        //hlf -- if call from Lemur - check for equipment and functional location
        if (bindingParams.HeaderEquipment){
            actionBinding.HeaderEquipment = bindingParams.HeaderEquipment;
        }

        if (bindingParams.HeaderFunctionLocation){
            actionBinding.HeaderFunctionLocation = bindingParams.HeaderFunctionLocation;
        }


    clientAPI.getPageProxy().setActionBinding(actionBinding);
    libCommon.setStateVariable(clientAPI, 'LocalId', ''); //Reset before starting create
    return clientAPI.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateChangeset.action').then(() => {
        return lamCopy(clientAPI);
    });
}
