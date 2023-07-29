import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusFormatStatusProfileDisplay(context) {
    let statprofile = libCommon.getStateVariable(context, 'zzUserStatusProfile');
    if (statprofile && statprofile !== ''){
        return statprofile;
}

return '$(L,NoProfileMsg)';
}
