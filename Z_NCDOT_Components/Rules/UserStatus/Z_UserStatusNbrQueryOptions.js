import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusNbrQueryOptions(context) {
   
    let profile = libCom.getStateVariable(context, 'zzUserStatusProfile');
    let query = "$filter=StatusProfile eq '" + profile + "' and ZZStatusNbr ne '00'&$orderby=ZZStatusNbr";
    return query;
   
}
