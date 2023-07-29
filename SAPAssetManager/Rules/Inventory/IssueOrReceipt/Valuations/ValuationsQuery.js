import isInventoryClerk from '../../../SideDrawer/EnableInventoryClerk';
import GetPlantName from '../../PurchaseOrder/GetPlantName';

export default function ValuationsQuery(context) {
    let binding = context.binding;
    if (!binding) return Promise.resolve({});
    let materialNum = context.binding.MaterialNum || context.binding.Material;
    //For reservation items the plant field is named SupplyPlant in backend MDO. For everything else, it's named Plant.
    let plant;
    if (isInventoryClerk(context)) {
        plant = GetPlantName(context);
    } else {
        plant = binding.Plant || binding.SupplyPlant || binding.PlanningPlant;
    }

    if (context.binding.RelatedItem) {
        plant = context.binding.RelatedItem[0].Plant; 
        materialNum = context.binding.RelatedItem[0].Material; 
    }

    const query = `$filter=Plant eq '${plant}' and MaterialNum eq '${materialNum}'&$expand=MaterialValuation_Nav`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query);
}
