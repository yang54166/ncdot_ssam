import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function DiscardReading(context) {
    let equipment = context.getPageProxy().binding.EquipmentNum;
    let register = context.getActionResult('ReadResult').data.getItem(0).RegisterNum;
    if (!equipment) {
        try {
            const pageBinding = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding;
            equipment = (pageBinding.Device_Nav ? pageBinding.Device_Nav.EquipmentNum : pageBinding.EquipmentNum) || pageBinding.EquipmentNum;
        } catch (exc) {
            // Fallback....?
            equipment = '';
        }
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$top=1&$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {

            let readingObject = result.getItem(0);

            //2 offline odata limitations here: We cannot call UndoPendingChanges on a reading if it errored out
            //We also cannot delete it from the ErrorArchive since it's a new object, the RequestURL doesn't have a readlink
            //So the only option is to delete the reading itself
            if (readingObject['@sap.inErrorState']) {
                context.getPageProxy().getClientData().binding = readingObject;
                return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsDiscard.action').then( () => {
                    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Meters/CreateUpdate/DiscardEntitySuccessMessage.action');
                });
            } else {
                context.getPageProxy().setActionBinding(readingObject);
                return context.executeAction('/SAPAssetManager/Actions/Meters/Discard/DiscardReading.action');
            }

        } else {
            return '';
        }
    });
}
