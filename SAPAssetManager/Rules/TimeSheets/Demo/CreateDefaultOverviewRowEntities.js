import FetchRequest from '../../Common/Query/FetchRequest';
import ODataDate from '../../Common/Date/ODataDate';

/**
 * Initialize the overview entities over the 
 * @param {*} context 
 */
export default function CreateDefaultOverviewRowEntities(context) {

    let date = new Date();
    // Remove timezone offset for iso date
    let timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    date = new Date(date.getTime() - timezoneOffset);
    // Add offset to next Sunday
    let offset = 7 - date.getDay();
    date.setDate(date.getDate() + offset);

    return createOverviewRowIfMissing(context, date, 0);
}

function createOverviewRowIfMissing(context, date, iteration) {
    if (iteration >= 14) {
        // Max iteration
        return Promise.resolve(true);
    }

    let odataDate = new ODataDate(date);

    return new FetchRequest('CatsTimesheetOverviewRows').get(context, odataDate.queryString(context, 'date')).then(() => {
        // Already exists, ignore
        return iterate(context, date, iteration);
    }).catch(() => {
        // Expected, this entity is missing
        return createMissingOverviewRow(context, odataDate).then(() => {
            return iterate(context, date, iteration);
        });
    });
}

function iterate(context, date, iteration) {
    date.setDate(date.getDate() - 1);
    return createOverviewRowIfMissing(context, date, iteration + 1);
}
/**
 * Create a TimeSheetOverviewRow for an odata date
 * @param {Context} context 
 * @param {ODataDate} odataDate 
 */
function createMissingOverviewRow(context, odataDate) {
    context.getPageProxy().getClientData().TimeSheetsOverviewRowDate = odataDate.toLocalDateString();
    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowCreate.action');
}
