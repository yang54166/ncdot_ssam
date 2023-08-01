import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_OperationStatusStyle(context) {
    //Z_FormCellLabelStarted 

    let completed = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let started = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
   
    let status;
    let binding = context.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        if (binding.OperationMobileStatus_Nav) { 
            status = context.binding.OperationMobileStatus_Nav.MobileStatus;
        }    
    }
    if (status === started) {
        return 'ZFormCellBackgroundStartTitle';
    } 
    if (status === completed) {
        return 'ZFormCellBackgroundCompleteTitle';
    } 


    return '';
}


   
  