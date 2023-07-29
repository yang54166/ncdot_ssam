import libCom from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import DownloadAndSaveMedia from '../DownloadAndSaveMedia';
import { CreateDocumentLinkPromises } from './DocumentCreateBDSLinkNoClose';
import getDocsData from './DocumentOnCreateGetStateVars';

export default function DocumentOnCreateLink(controlProxy) {
    const { parentEntitySet, parentProperty, ObjectKey, entitySet } = getDocsData(controlProxy);
    const localId = libCom.getStateVariable(controlProxy, 'LocalId');
    let filter = `$filter=${ObjectKey} eq '${localId}'`;
    if (parentEntitySet === 'S4ServiceItems') {
        const itemNo = libCom.getStateVariable(controlProxy, 'lastLocalItemId');
        filter = `$filter=ObjectID eq '${localId}' and ${ObjectKey} eq '${itemNo}'`;
    }
    if (parentEntitySet === 'MyWorkOrderOperations') {
        let operationNo = libCom.getStateVariable(controlProxy, 'lastLocalOperationId');
        filter = `$filter=OrderId eq '${localId}' and ${ObjectKey} eq '${operationNo}'`;
    }
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', parentEntitySet, [], filter).then(result => {
        if (ValidationLibrary.evalIsEmpty(result)) {
            return '';
        }
        const entity = result.getItem(0);
        const parentReadLink = entity['@odata.readLink'];
        const properties = { ObjectKey: localId };
        const readLinks = controlProxy.getClientData().mediaReadLinks;
        const promises = CreateDocumentLinkPromises(controlProxy, readLinks, parentReadLink, parentProperty, parentEntitySet, entitySet, properties);
        return Promise.all(promises).then(() => {
            DownloadAndSaveMedia(controlProxy);
        }).catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
    });
}
