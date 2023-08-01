export default function Z_FunctionalAreaFormatDisplay(context) {
    if (!context.getPageProxy().binding.ZZFunctionalArea) {
        return '';
    }
    let fa = `$filter=Z_FunctionalArea eq '` + context.getPageProxy().binding.ZZFunctionalArea + `'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Z_FunctionalAreas', [], fa).then(result => {
        if (result) {
            return 'Functional Area ' + result.getItem(0).Z_FunctionalArea + ' - '  + result.getItem(0).Z_Description;
        }
    });
}
