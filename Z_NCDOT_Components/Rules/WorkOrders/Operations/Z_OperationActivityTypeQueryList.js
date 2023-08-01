
export default function Z_OperationActivityTypeQueryList(context) {
    let orderType = 'ZCAR';

    if (!context.binding.WOHeader.OrderType){
        orderType = context.binding.WOHeader.OrderType
    }
    return `$filter=OrderType eq  '${orderType}' &$orderby=ActivityType`;
}
