export default function FunctionalLocationQueryOptions(context) {
    let binding = context.getPageProxy().binding;
    let searchString = context.searchString;
    
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        let filter = `(WorkOrderHeader/any( wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderOperation/WOHeader/any(wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderSubOperation/WorkOrderOperation/WOHeader/any( wo: wo/OrderId eq '${binding.OrderId}'))`;
        if (searchString) {
            let qob = context.dataQueryBuilder();  
            //hlf - add geometries
            qob.expand('FuncLocGeometries/Geometry,WorkOrderHeader,WorkCenter_Main_Nav,MeasuringPoints,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav').select('*,WorkCenter_Main_Nav/*,MeasuringPoints/Point');
            let filters = [
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/PlantId))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterDescr))`,
                `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterName))`,
                `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/ExternalWorkCenterId))`,
            ]; 
            qob.filter(`${filter} and (${filters.join(' or ')})`);
            return qob;
        }
        //hlf - add geometries
        return `$expand=FuncLocGeometries/Geometry,WorkOrderHeader,WorkCenter_Main_Nav,MeasuringPoints,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav&$select=*,WorkCenter_Main_Nav/*,MeasuringPoints/Point&$filter=${filter}`;
    }

    if (searchString) {
        let qob = context.dataQueryBuilder();
        //hlf - add geometries
        qob.expand('FuncLocGeometries/Geometry,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav,WorkCenter_Main_Nav,MeasuringPoints,FuncLocDocuments').select('*,WorkCenter_Main_Nav/*,MeasuringPoints/Point').orderBy('FuncLocId');
        let filters = [
            `substringof('${searchString.toLowerCase()}', tolower(FuncLocDesc))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/PlantId))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterDescr))`,
            `substringof('${searchString.toLowerCase()}', tolower(FuncLocId))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/WorkCenterName))`,
            `substringof('${searchString.toLowerCase()}', tolower(WorkCenter_Main_Nav/ExternalWorkCenterId))`,
        ];
        qob.filter(`(${filters.join(' or ')})`);   //https://launchpad.support.sap.com/#/notes/3272970
        return qob;
    } else {
        //hlf - add geometries
        return '$expand=FuncLocGeometries/Geometry,ObjectStatus_Nav/SystemStatus_Nav,WorkCenter_Main_Nav,MeasuringPoints,FuncLocDocuments,SystemStatuses_Nav/SystemStatus_Nav,UserStatuses_Nav/UserStatus_Nav&$select=*,ObjectStatus_Nav/SystemStatus_Nav/StatusText,WorkCenter_Main_Nav/*,MeasuringPoints/Point';
    }
}
