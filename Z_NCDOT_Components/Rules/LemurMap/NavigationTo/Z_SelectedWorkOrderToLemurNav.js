import dueDate from '../../../../SAPAssetManager/Rules/DateTime/DueDate';

export default function Z_SelectedWorkOrderToLemurNav(context) {

    let oid = '';
    let geometry = '';
    let equipDesc = '';
    let flDesc = '';
    let priority = context.binding.Priority;

    if (context.binding.WOGeometries.length > 0) {
        geometry = context.binding.WOGeometries[0].Geometry.GeometryValue;
        oid = context.binding.WOGeometries[0].Geometry.SpacialId;
    }

    // if (context.binding.Equipment) {
    //     equipDesc = context.binding.HeaderEquipment + ' - ' + context.binding.HeaderEquipment.EquipDesc;
    // }

    if (context.binding.FunctionalLocation) {
        flDesc = context.binding.HeaderFunctionLocation + ' - ' + context.binding.FunctionalLocation.FuncLocDesc;
    }

    if (context.binding.WOPriority) {
        priority = context.binding.Priority + ' - ' + context.binding.WOPriority.PriorityDescription;
    }

    let workorders =
    {
        "workOrder": [
            {
                'WO': context.binding.OrderId,
                'Noti': context.binding.NotificationNumber,
                'Prio': priority,
                'Desc': context.binding.OrderDescription,
                'Type': context.binding.OrderType,
                'FL': flDesc,
                'WC': context.binding.MainWorkCenter,
                'Pplt': context.binding.PlanningPlant,
                'Sort': context.binding.SortField,
                "Stat": context.binding.OrderMobileStatus_Nav.MobileStatus,
                'Ddt': dueDate(context),
                'RsDt': context.binding.RequestStartDate,
                'Geo': geometry,
                'OID': oid

            }
        ]
    }

    let expand = '$expand=WOHeader,FunctionalLocationOperation,OperationMobileStatus_Nav,WOHeader/WOGeometries/Geometry';
    let entitySet = context.binding['@odata.readLink'] + '/Operations';
    let operations = [];
    let workorderGroup = [];

    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], expand)
        .then(result => {
            result.forEach(element => {
                oid = '';
                flDesc = '';
                geometry = '';


                if (element.WOHeader.WOGeometries.length > 0) {
                    geometry = element.WOHeader.WOGeometries[0].Geometry.GeometryValue;
                    oid = element.WOHeader.WOGeometries[0].Geometry.SpacialId;
                }

                if (element.FunctionalLocation) {
                    flDesc = element.HeaderFunctionLocation + ' - ' + element.FunctionalLocation.FuncLocDesc;
                }

                operations.push
                    (
                        {
                            'WO': element.OrderId,
                            'OP': element.OperationNo,
                            'Desc': element.OperationShortText,
                            'CK': element.ControlKey,
                            'FL': flDesc,
                            'WC': element.MainWorkCenter,
                            'SsDt': element.SchedEarliestStartDate,
                            'SlsDt': element.SchedEarliestStartDate,
                            'Geo': geometry,
                            'OID': oid,
                            "Stat": element.OperationMobileStatus_Nav.MobileStatus,
                        }
                    )
            })
            
            workorderGroup.push(
                {
                    'workorders': workorders,
                    'operations': operations
                })
            return workorderGroup
        }).then (workorderGroup =>{
            return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(workorderGroup))}`);

        })
}