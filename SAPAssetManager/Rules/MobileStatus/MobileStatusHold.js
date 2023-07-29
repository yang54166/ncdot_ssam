import libCommon from '../Common/Library/CommonLibrary';

export default function MobileStatusHold(context) {
    return libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());    
}
