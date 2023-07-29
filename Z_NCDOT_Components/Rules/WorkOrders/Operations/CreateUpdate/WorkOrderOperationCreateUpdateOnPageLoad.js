import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';
import style from '../../../../../SAPAssetManager/Rules/Common/Style/StyleFormCellButton';
import hideCancel from '../../../../../SAPAssetManager/Rules/ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../../../../../SAPAssetManager/Rules/Documents/SetUpAttachmentTypes';

export default function WorkOrderOperationCreateUpdateOnPageLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    libOperationEvent.createUpdateOnPageLoad(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
    SetUpAttachmentTypes(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
    return Promise.resolve(true);
}
