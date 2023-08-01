import dueDate from '../../../../SAPAssetManager/Rules/DateTime/DueDate';

export default function Z_ListExtractWorkOrderOperation(context) {
    let workorders = [];
    let operations = [];
    let workorderGroup = [];
    let geometry = '';
    let oid = '';
    //let equipDesc = '';
    let flDesc = '';
    let priority = ''

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=WOPriority,FunctionalLocation,Equipment,OrderMobileStatus_Nav,WOGeometries/Geometry`)
        .then(result => {
            result.forEach(element => {
                oid = '';
                priority = element.Priority;                
                flDesc = '';
                geometry = '';

                if (element.WOGeometries.length > 0) {
                    geometry = element.WOGeometries[0].Geometry.GeometryValue;
                    oid = element.WOGeometries[0].Geometry.SpacialId;
                }

                if (element.FunctionalLocation) {
                    flDesc = element.HeaderFunctionLocation + ' - ' + element.FunctionalLocation.FuncLocDesc;
                }

                if (element.WOPriority) {
                    priority = element.Priority + ' - ' + element.WOPriority.PriorityDescription;
                }

                workorders.push
                    (
                        {
                            'WO': element.OrderId,
                            'Noti': element.NotificationNumber,
                            'Prio': priority,
                            'Desc': element.OrderDescription,
                            'Type': element.OrderType,
                            'FL': flDesc,
                            'WC': element.MainWorkCenter,
                            'Pplt': element.PlanningPlant,
                            'Sort': element.SortField,
                            "Stat": element.OrderMobileStatus_Nav.MobileStatus,
                            'Ddt': dueDate(context),
                            'RsDt': element.RequestStartDate,
                            'Geo': geometry,
                            'OID': oid
                        }
                    )
            })
            return workorders;
        })
        .then(result => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], `$expand=WOHeader,FunctionalLocationOperation,OperationMobileStatus_Nav,WOGeometries/Geometry`)
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
                            'Desc': element.OperationShortText                      ,
                            'CK': element.ControlKey ,
                            'FL': flDesc,
                            'WC': element.MainWorkCenter,
                            'SsDt': element.SchedEarliestStartDate,
                            'SlsDt': element.SchedEarliestStartDate,
                            'Geo': geometry,
                            'OID': oid,
                            "Stat": element.OrderMobileStatus_Nav.MobileStatus,
                        }
                    )
                    workorderGroup.push(
                        {'workorders': workorders, 
                         'operations': operations })

                        return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(workorderGroup))}`);
                    })

                })
            })
        }
// let orders = [
//     {
//         'OrderId': '40001',
//         'WOGeometries': [
//             {
//                 "SpacialId": "153",
//                 "Geometry": {
//                     "GeometryValue": "{\"x\":-87.7491356,\"y\":42.054769999999984,\"spatialReference\":{\"wkid\":4326,\"latestWkid\":4326}}",
//                 }
//             }
//         ]
//     },
//     {
//         'OrderId': '40002',
//         'WOGeometries': [
//             {
//                 "SpacialId": "153",
//                 "Geometry": {
//                     "GeometryValue": "{\"x\":-87.7491356,\"y\":42.054769999999984,\"spatialReference\":{\"wkid\":4326,\"latestWkid\":4326}}",
//                 }
//             }
//         ]
//     }

// ]; // Get from read GET MyWorkOrderHeaders

// let operations = [
//     {
//         'OrderId': '40001',
//         'OperationNo': '0010'
//     },
//     {
//         'OrderId': '40001',
//         'OperationNo': '0020'
//     },
//     {
//         'OrderId': '40002',
//         'OperationNo': '0010'
//     }

// ]; // Get from read GET MyWorkOrderOperations

// //let toLemur = {'Orders': [{'OrderId': '40001'}, {'OrderId': '40002'}], 'Operations': [{'OrderId': '40001', 'OperationNo': '0010'}, {'OrderId': '40001', 'OperationNo': '0020'}, {'OrderId': '40002', 'OperationNo': '0010'}]}
// orders.map(element => {
//     return { 'OrderId': element.OrderId, 'SpacialId': element.WOGeometries[0].SpacialId, 'GeometryValue': element.WOGeometries[0].Geometry.GeometryValue };
// });

// let workorders = [];
// let orderHeaders = [];
// let operations = []
// workorders.push(headers: orderHeaders, operation: )