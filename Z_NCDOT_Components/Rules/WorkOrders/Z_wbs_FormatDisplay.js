export default function Z_wbs_FormatDisplay(context) {
    if (Number(context.getPageProxy().binding.ZZwbs) === 0) {
        return '';
    }
    let wbsQuery = `Z_wbs_Elements('` + context.getPageProxy().binding.ZZwbs + `')`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', wbsQuery, [], '').then(result => {
        if (result) {
            let wbsDisp = result.getItem(0).Z_wbs_ext_id + ' - '  + result.getItem(0).Z_Description;
            return 'WBS: ' + wbsDisp ;
        }
    });
}
