import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusDisplayStatusSelected(context) {
   let selectedStatus = libCommon.getStateVariable(context, 'ZSelectedUserStatus');
    let status = context.binding.UserStatus;

    if ( selectedStatus && selectedStatus.includes(status)) {
        return true;
    }
    return false;
}
