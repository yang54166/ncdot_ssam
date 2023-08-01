export default function Z_SelectedFlocToLemurNav(context) {
    let oid = '';
    let geometry = '';

    if (context.binding.FuncLocGeometries.length > 0) {
        geometry = context.binding.FuncLocGeometries[0].Geometry.GeometryValue;
        oid = context.binding.FuncLocGeometries[0].Geometry.SpacialId;
    }

    let flocs =
    {
        "Flocs": [
            {
                'FL': context.binding.FuncLocId,
                'Desc': context.binding.FuncLocDesc,
                'Type': context.binding.FuncLocType,
                'Pplt': context.binding.PlanningPlant,
                'Mplt': context.binding.MaintPlant,
                'Sort': context.binding.ZZSortField,
                'Geo': geometry,
                'OID': oid
            }
        ]

    };

 //   return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${JSON.stringify(flocs)}`)
    return context.nativescript.utilsModule.openUrl(`ctglemurpro://Load/?BusinessObjectsJson=${encodeURIComponent(JSON.stringify(flocs))}`);

}

