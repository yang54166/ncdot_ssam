import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusNoNbrQueryOptions(context) {
 
   let profile = libCom.getStateVariable(context, 'zzUserStatusProfile');
    let query = "$filter=StatusProfile eq '" + profile + "' and ZZStatusNbr eq '00'&$orderby=ZZPosition";
    return query

}
