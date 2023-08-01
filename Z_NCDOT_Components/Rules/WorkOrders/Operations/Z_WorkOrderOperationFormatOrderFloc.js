import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_WorkOrderOperationFormatOrderFloc(context) {
    
    if (libCommon.isDefined(context.binding.WOHeader.HeaderFunctionLocation) && context.binding.WOHeader.FunctionalLocation) {
        return  '(' + context.binding.WOHeader.HeaderFunctionLocation + ') ' + context.binding.WOHeader.FunctionalLocation.FuncLocDesc;
    } else {
        return context.binding.WOHeader.HeaderFunctionLocation;
	}

}
