import CommonLibrary from '../Common/Library/CommonLibrary';
import WorkOrderDetailsNavQueryOptions from './Details/WorkOrderDetailsNavQueryOptions';
import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function FollowOnWorkOrderListViewCaption(context) {
    let reference = context.getPageProxy().binding.OrderId; 
    return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, `$filter=ReferenceOrder eq '${reference}'&`+ WorkOrderDetailsNavQueryOptions() + '&$orderby=Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus')).then(count => {
        context.getPageProxy().getClientData().Count= count;
        return  `Work Orders (${count})`;
    });
}
