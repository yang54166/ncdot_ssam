export default function GetPlantSloc(context) {
    let binding = context.binding;
    if (binding) {
        if (binding.MaterialSLocs && binding.MaterialSLocs.length) {
            return `${binding.Plant}/${binding.MaterialSLocs[0].StorageLocation}`;
        }
        return binding.Plant;
    }
    return '';
}
