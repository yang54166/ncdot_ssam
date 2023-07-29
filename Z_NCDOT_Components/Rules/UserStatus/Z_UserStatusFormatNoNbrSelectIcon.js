/**
 * Describe this function...
 * @param {IClientAPI} context
 * 
 */
export default function Z_UserStatusFormatNoNbrSelectIcon(context) {
    let ordUserStat = context.getPageProxy().getBindingObject().OrderMobileStatus_Nav.UserStatus;
    let status = context.binding.Status;
    if (ordUserStat && ordUserStat && ordUserStat.includes(status)){
        return '/SAPAssetManager/Images/Checkbox_selected.png';
    }
    return '/SAPAssetManager/Images/no_grid_icon.png';
}