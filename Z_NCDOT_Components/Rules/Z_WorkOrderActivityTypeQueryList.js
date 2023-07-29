
export default function Z_WorkOrderActivityTypeQueryList(context) {
    let orderType = 'ZCAR';

    if (!context.binding.OrderType){
        orderType = context.binding.OrderType
    }
    return `$filter=OrderType eq  '${orderType}' &$orderby=ActivityType`;
}
