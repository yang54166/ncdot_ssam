
export default function Z_OpertionDisplayAssignedTo(context) {

    if (!context.binding.PersonNum) {
        return '';
    }
    let empQuery = "Employees('" + context.binding.PersonNum + `')`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', empQuery, [], '').then(result => {
        if (result) {
            let emp = result.getItem(0).PersonnelNumber + ' - '  + result.getItem(0).EmployeeName;
            return 'Assigned to : ' + emp ;
        }
        return 'Assigned to : ' + context.binding.PersonNum;
    });

}
