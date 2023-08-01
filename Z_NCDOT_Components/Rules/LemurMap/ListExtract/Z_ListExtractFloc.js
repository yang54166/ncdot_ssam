
export default function Z_ListExtractFloc(context) {
    let oid = '';
    let geometry = '';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$expand=FuncLocLongText_Nav,FuncLocGeometries/Geometry`)
        .then(result => {
            let flocs = [];

            result.forEach(element => {
                oid = '';
                geometry = '';

                    if (element.FuncLocGeometries.length > 0) {
                        geometry = element.FuncLocGeometries[0].Geometry.GeometryValue;
                        oid = element.FuncLocGeometries[0].Geometry.SpacialId;
                    }

                    flocs.push(
                        {
                            'FL': element.FuncLocId,
                            'Desc': element.FuncLocDesc,
                            'Type': element.FuncLocType,
                            'Pplt': element.PlanningPlant,
                            'Mplt': element.MaintPlant,
                            'Sort': element.ZZSortField,
                            'Geo': geometry,
                            'OID': oid
                        } );
            });

           
            return flocs;
        });
}
