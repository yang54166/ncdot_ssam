/**
* Show/hide Note add button based on parent object and user authorization
* @param {IClientAPI} context
*/
import editNotificaitonEnabled from '../Notifications/EnableNotificationEdit';
import editWorkOrderEnabled from '../WorkOrders/EnableWorkOrderEdit';

export default function EnableNoteCreate(context) {
     // Enable note creation depending on the entity set
     const entityName = context.binding['@odata.type'].split('.')[1];
     switch (entityName) {
        case 'MyNotification':
            return (editNotificaitonEnabled(context));
        case 'S4ServiceOrder':
        case 'S4ServiceRequest':
        case 'MyWorkOrder':
            return (editWorkOrderEnabled(context));
        case 'MyFunctionalLocation':
            return false;
        case 'MyEquipment':
            return false;
        case 'PurchaseOrderHeader':
            return false;
        case 'WCMDocumentItem':
            return false;
        case 'S4ServiceConfirmation': 
            return true;
        default:
            return true;
     }
}
