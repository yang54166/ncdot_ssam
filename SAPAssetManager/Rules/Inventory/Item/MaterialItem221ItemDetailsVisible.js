export default function MaterialItem221ItemDetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('MaterialDocItem') && (move === '221' || move === '222');
}
