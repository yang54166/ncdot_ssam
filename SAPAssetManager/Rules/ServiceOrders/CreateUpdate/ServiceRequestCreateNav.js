import libCommon from '../../Common/Library/CommonLibrary';
import libS4 from '../S4ServiceLibrary';

export default function ServiceRequestCreateNav(context) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libS4.setOnSRChangesetFlag(context, true);

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    libCommon.setStateVariable(context, 'LocalId', ''); //Reset before starting create

    const defaultPriority = libCommon.getAppParam(context, 'S4SERVICEORDER', 'Priority');

    let binding = context.binding;
    let actionBinding = {
        Priority: '5',
        Urgency: '75',
        Impact: '50',
    };

    if (libCommon.isDefined(binding)) {
        let { HeaderEquipment, HeaderFunctionLocation, Product } = libS4.getRefObjectsIDsFromBinding(binding);
        actionBinding.HeaderEquipment = HeaderEquipment;
        actionBinding.HeaderFunctionLocation = HeaderFunctionLocation;
        actionBinding.Product = Product;
        actionBinding.Description = binding.Description;
        actionBinding.ObjectID = binding.ObjectID;
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
            actionBinding.Priority = binding.Priority === '0' ? defaultPriority : binding.Priority;
            actionBinding.SoldToParty = binding.SoldToParty;
            actionBinding.SalesOrg = binding.SalesOrg;
            actionBinding.BillToParty = binding.BillToParty;
            actionBinding.ServiceOrg = binding.ServiceOrg;
        }
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceRequestPartner') {
            actionBinding.SoldToParty = binding.BusinessPartnerID;
        }
        if (binding['@odata.type'] === '#sap_mobile.MyEquipment') {
            actionBinding.HeaderEquipment = binding.EquipId;
        }
        if (binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
            actionBinding.HeaderFunctionLocation = binding.FuncLocIdIntern;
        }
    }

    context.getPageProxy().setActionBinding(actionBinding);
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceRequestCreateChangeSet.action');
}
