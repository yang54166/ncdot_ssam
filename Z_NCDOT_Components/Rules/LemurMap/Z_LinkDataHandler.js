import WorkOrderCreate from './CreateUpdate/Z_WorkOrderCreateFromLemurNav';
import NotificationCreate from '../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateChangeSetNav';

export default function Z_LinkDataHandler(clientAPI) {
    let linkData = clientAPI.getAppEventData();
    let jsonLinkData = JSON.parse(linkData);
    let action = jsonLinkData.URL;
    let parameters = jsonLinkData.Parameters;
    let uri = parameters.id;
    let actionBinding = '' ;
  
    switch (action) {
        case 'createnotification':
            return NotificationCreate(clientAPI, {'HeaderEquipment': parameters.equipid, 'HeaderFunctionLocation':parameters.floc  });
        case 'createworkorder':
            return WorkOrderCreate(clientAPI, {'HeaderEquipment': parameters.equipid, 'HeaderFunctionLocation':parameters.floc  });
        default: 
            break;
    }




}
