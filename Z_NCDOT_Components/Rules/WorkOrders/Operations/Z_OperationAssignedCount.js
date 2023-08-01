import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_OperationAssignedCount(context) {
    let personNbr = libCommon.getPersonnelNumber();
    // get prabha number
    personNbr = '01555611';
    const queryOptions = "$filter=PersonNum eq '" + personNbr + "'";
   
    return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderOperations',queryOptions).then(count => {
        return count;
    });
}
