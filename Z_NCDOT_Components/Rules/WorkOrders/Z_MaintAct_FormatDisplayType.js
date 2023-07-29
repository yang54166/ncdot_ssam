export default function Z_MaintAct_FormatDisplayType(context) {
   let acttype = '';
   let ordType = '';

   if (context.getPageProxy().binding['@odata.type']=== '#sap_mobile.MyWorkOrderHeader'){
            acttype = context.getPageProxy().binding.MaintenanceActivityType;
            ordType = context.getPageProxy().binding.OrderType
   } else
   {
            acttype = context.getPageProxy().binding.ZZMaintenanceActivityType;
            ordType = context.getPageProxy().binding.WOHeader.OrderType;
   }

    if (acttype) {

        let actQuery = `ActivityTypes(ActivityType='` + acttype + `',OrderType= '` + ordType + `')`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', actQuery, [], '').then(result => {
            if (result) {
                let actDisp = result.getItem(0).ActivityType + ' - ' + result.getItem(0).ActivityTypeDescription;
                return actDisp;
            }
        });
    }
}
