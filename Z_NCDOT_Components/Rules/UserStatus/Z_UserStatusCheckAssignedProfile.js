import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';


export default function Z_UserStatusCheckAssignedProfile(context) {
    let statProfile = libCommon.getStateVariable(context, 'zzUserStatusProfile');
    if (statProfile && statProfile !== ''){
            return true;
    }

    return false;
}
