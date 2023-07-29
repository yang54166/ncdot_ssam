export default function MeasuringPointDescription(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        return binding.PRTPoint.PointDesc;
    }
    if (Object.prototype.hasOwnProperty.call(binding,'PointDesc')) {
        return binding.PointDesc;
    } else {
        return binding.MeasuringPoint.PointDesc;
    }
}
