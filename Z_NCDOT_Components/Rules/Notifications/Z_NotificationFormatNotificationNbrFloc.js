import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_NotificationFormatNotificationNbrFloc(context) {
    
    if (libCommon.isDefined(context.binding.HeaderFunctionLocation) && context.binding.FunctionalLocation) {
        return context.binding.NotificationNumber + ' - (' + context.binding.HeaderFunctionLocation + ') ' + context.binding.FunctionalLocation.FuncLocDesc;
    } else {
        return context.binding.NotificationNumber;
	}

}
