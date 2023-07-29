import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';
import style from '../../../../SAPAssetManager/Rules/Common/Style/StyleFormCellButton';
import hideCancel from '../../../../SAPAssetManager/Rules/ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ApplicationSettings from '../../../../SAPAssetManager/Rules/Common/Library/ApplicationSettings';
import SetUpAttachmentTypes from '../../../../SAPAssetManager/Rules/Documents/SetUpAttachmentTypes';

export default function WorkOrderCreateUpdateOnPageLoad(pageClientAPI) {
    // clear the geometry cache
    ApplicationSettings.setString(pageClientAPI, 'Geometry', '');

    hideCancel(pageClientAPI);
    LibWoEvent.createUpdateOnPageLoad(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');

    SetUpAttachmentTypes(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);

    //hlf
     let transType = libCom.getStateVariable(pageClientAPI, 'TransactionType');
     if (transType === 'UPDATE'){
    //       //hlf - set up query for function area
         let formCellContainerProxy = pageClientAPI.getControl('FormCellContainer');
    //       let functionArea = formCellContainerProxy.getControl('Z_functionAreaLstPkr');
    //       let wbs = formCellContainerProxy.getControl('Z_wbsListPkr');
           let actType = formCellContainerProxy.getControl('Z_MaintActType');

           let isLocal = libCom.isCurrentReadLinkLocal(pageClientAPI.binding['@odata.readLink']);
           if (!isLocal){
    //             functionArea.setEditable(false);
    //             wbs.setEditable(false);
                actType.setEditable(false);
           }
    //       if (isLocal && pageClientAPI.binding.ZZwbs){
    //         let wbs = `Z_wbs_Elements('` + pageClientAPI.binding.ZZwbs + `')`;
            
    //         functionArea.setEditable(true);
    //         return  pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', wbs, [], '$select=Z_Phase').then(result => {
    //             if (result)
    //             {
    //                 let phase = result.getItem(0).Z_Phase;
                    
    //                 let functionAreaTargetSpecifier = functionArea.getTargetSpecifier();
    //                 let filter = "$filter= Z_Phase eq '" + phase + "'";
    //                 let orderBy = '$orderby=Z_FunctionalArea';
    //                 functionAreaTargetSpecifier.setQueryOptions(filter +  '&' + orderBy);
                    
    //                 functionArea.setTargetSpecifier(functionAreaTargetSpecifier);
    //                 pageClientAPI.getClientData().LOADED = true;
    //             }
    //         });
    //       }
    }
}
