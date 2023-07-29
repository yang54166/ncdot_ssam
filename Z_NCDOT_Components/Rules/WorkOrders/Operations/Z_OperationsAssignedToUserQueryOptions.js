//import { OperationConstants as Constants, OperationLibrary } from './WorkOrderOperationLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function Z_OperationsAssignedToUserQueryOptions(context) {
    let personNbr = libCommon.getPersonnelNumber();
    // get prabha number
    personNbr = '01555611';
  //  const queryOptions = "$expand=WOHeader/FunctionalLocation,WOHeader/Notification/HeaderLongText&$filter=PersonNum eq '" + personNbr + "' &$orderby=WOHeader/Priority,WOHeader/DueDate,OrderId&$top=4";
  let expands = '&$expand=WOHeader/Notification/HeaderLongText,WOHeader/Notification/NotifMobileStatus_Nav,WOHeader/FunctionalLocation,WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav,WOOprDocuments_Nav/Document';
   let filter = "$filter=PersonNum eq '" + personNbr + "' ";
   let orderby = "&$orderby=WOHeader/Priority,WOHeader/DueDate,OrderId&$top=4";
   const queryOptions = filter + expands + orderby;

   return queryOptions;
}

