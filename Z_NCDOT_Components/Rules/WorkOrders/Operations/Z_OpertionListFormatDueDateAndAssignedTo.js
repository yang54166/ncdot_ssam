import dueDate from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderDueDate'

export default function Z_OpertionListFormatDueDateAndAssignedTo(context) {

    let formatDtPer = 'Due Date : ' + dueDate(context);

    if (context.binding.PersonNum === '00000000') {
        return formatDtPer;
    }
    else {
        try {
            let empQuery = "Employees('" + context.binding.PersonNum + `')`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', empQuery, [], '').then(result => {
                formatDtPer = formatDtPer + ' - Assigned to : ' + context.binding.PersonNum;

                if (result) {
                    let emp = result.getItem(0).EmployeeName;
                    formatDtPer = formatDtPer + ' - ' + emp;

                }
                return formatDtPer;
            });
        }
        catch (err) {
            return formatDtPer;
        }
    }

}
