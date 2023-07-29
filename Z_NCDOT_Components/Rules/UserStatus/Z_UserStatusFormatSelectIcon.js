import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusFormatSelectIcon(context) {
    let userStat = libCommon.getStateVariable(context, 'ZSelectedUserStatus');
        let status = context.binding.UserStatus;
        if  (userStat && userStat.includes(status)){
            return ['sap-icon://sys-enter-2'];
        }
        return [];
    }
