import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libS4 from '../S4ServiceLibrary';

export default function ServiceOrderCreateUpdateControlsQueryOptions(controlProxy) {
    let controlName;
    let context;
    try {
        controlName = controlProxy.getName();
        context = controlProxy.getPageProxy();
    } catch (err) {
        controlProxy = controlProxy.binding.clientAPI;
        controlName = controlProxy.getName();
        context = controlProxy.getPageProxy();
    }

    let binding = context.binding;
    let planningPlant;
    if (GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK')) {
        planningPlant = GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK');
    }
    // Based on the control we are on, return the right query or list items accordingly
    switch (controlName) {
        case 'FuncLocHierarchyExtensionControl':
            {
                if (planningPlant) {
                    return `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                } else {
                    return '$orderby=FuncLocId';
                }
            }
        case 'EquipHierarchyExtensionControl':
            {
                let funcLoc;
                funcLoc = context.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                // if (!funcLoc && funcLoc !== '') {
                //     funcLoc = libCommon.getTargetPathValue(controlProxy, '#Property:HeaderFunctionLocation');
                // }
                if (funcLoc) {
                    return `$orderby=EquipId&$filter=(FuncLocIdIntern eq '${funcLoc}')`;
                } else if (planningPlant) {
                    return `$orderby=EquipId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                } else {
                    return '$orderby=EquipId';
                }
            }
        case 'ProcessTypeLstPkr':
            return `$orderby=TransactionType&$filter=TransCategory eq '${libS4.getServiceOrderObjectType(context)}'`;
        case 'SalesOrgLstPkr':
            return `$expand=SalesOrg_Nav&$filter=OrgType eq '1' and TransactionType eq '${binding.ProcessType}'`;
        case 'ServiceOrgLstPkr':
            return `$expand=ServiceOrg_Nav&$filter=OrgType eq '2' and TransactionType eq '${binding.ProcessType}'`;
        default:
            return '';
    }
}
