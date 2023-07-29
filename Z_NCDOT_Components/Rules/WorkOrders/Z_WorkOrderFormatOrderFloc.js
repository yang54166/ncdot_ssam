import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_WorkOrderFormatOrderFloc(context) {
    // because of the bad bug in MDK the extension must be done also in SAPAssetManager
    // to expand the functionallocation
    
    if (libCommon.isDefined(context.binding.HeaderFunctionLocation) && context.binding.FunctionalLocation) {
        return context.binding.OrderId + ' - (' + context.binding.HeaderFunctionLocation + ') ' + context.binding.FunctionalLocation.FuncLocDesc;
    } else {
        return context.binding.OrderId;
	}

}
