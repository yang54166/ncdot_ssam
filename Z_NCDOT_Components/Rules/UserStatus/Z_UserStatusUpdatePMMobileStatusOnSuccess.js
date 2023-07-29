import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusUpdatePMMobileStatusOnSuccess(context) {

    libCommon.removeStateVariable(context, 'ZNewNbrUserStatus');
    return context.executeAction('/Z_NCDOT_Components/Actions/Z_CloseModelCancel.action');
}
