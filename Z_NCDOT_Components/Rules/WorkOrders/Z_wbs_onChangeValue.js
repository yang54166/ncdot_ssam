import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function Z_wbs_onChangeValue(context) {
    let pageProxy = context.getPageProxy();
    let wbs = `Z_wbs_Elements('` + context.getValue()[0].ReturnValue + `')`;
    let functionArea = libCom.getControlProxy(pageProxy, 'Z_functionAreaLstPkr');
    let faVal = functionArea.getValue();
 
    functionArea.setEditable(true);
    return  context.read('/SAPAssetManager/Services/AssetManager.service', wbs, [], '$select=Z_Phase').then(result => {
        
        if (result)
        {
            let phase = result.getItem(0).Z_Phase;
            let functionAreaTargetSpecifier = functionArea.getTargetSpecifier();
            let filter = "$filter= Z_Phase eq '" + phase + "'";
            let orderBy = '$orderby=Z_FunctionalArea';
            functionAreaTargetSpecifier.setQueryOptions(filter +  '&' + orderBy);
            
            functionArea.setTargetSpecifier(functionAreaTargetSpecifier);

            if (faVal.length > 0){
                let selectedaFA = faVal[0].ReturnValue;
                let fa = `Z_FunctionalAreas(Z_FunctionalArea ='` + selectedaFA + `',Z_Phase= '` + phase + `')`;
           
                return  context.count('/SAPAssetManager/Services/AssetManager.service', fa, [], '').then(result => {
                    if (result === 0) {
                            faVal = functionArea.setValue('');
                    }
                })
           
            }
        }
    });
       
}
