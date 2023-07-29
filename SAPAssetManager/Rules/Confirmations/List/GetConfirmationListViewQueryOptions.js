import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Query options for confirmation list view screen
* @param {IClientAPI} context
*/
export default function GetConfirmationListViewQueryOptions(context) {
    let clientData = context.evaluateTargetPath('#Page:S4ConfirmationsListViewPage/#ClientData');
    let tabFilters = context.filters;
    let filters = [];
    if (tabFilters && tabFilters.length) {
        const items = tabFilters.map(val => val.filterItems.filter(subval => subval.includes('MobileStatus') || subval.includes('FinalConfirmation')))[tabFilters.length - 1];
        clientData.statusLstPickerValues = items;
        filters.push(items);
    } else {
        clientData.statusLstPickerValues = [];
    }

    let searchString = context.searchString;
    let expand = '$expand=ServiceConfirmationItems_Nav,MobileStatus_Nav,RefObjects_Nav/MyEquipment_Nav,RefObjects_Nav/MyFunctionalLocation_Nav,RefObjects_Nav/Material_Nav,Partners_Nav,OrderTransHistory_Nav,Document';

    if (searchString) {
        let search = [];
        //Standard order filters (required when using a dataQueryBuilder)
        search.push(`substringof('${searchString}', tolower(Description))`);
        search.push(`substringof('${searchString}', tolower(ObjectID))`);
        filters.push('(' + search.join(' or ') + ')');
    }

    if (libCom.isDefined(context.binding) && libCom.isDefined(context.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        let extraFilter = S4ServiceLibrary.getConfirmationFilters(context).slice(8);
        if (extraFilter.trim()) {
            filters.push(extraFilter.trim());
        }
    }

    let query = expand;
    if (filters.length) {
        query += '&$filter=' + filters.join(' and ');
    }

    setCaption(context, filters.join(' and '));

    return query;
}

function setCaption(context, queryOptions) {
    let filters = S4ServiceLibrary.getCaptionQuery(context, 'S4ConfirmationsListViewPage');
    if (filters) {
        if (queryOptions) {
            queryOptions += ' and (' + filters + ')';
        } else {
            queryOptions = filters;
        }
    }

    if (queryOptions) {
        queryOptions = '$filter=' + queryOptions;
    }

    return S4ServiceLibrary.getListCountCaption(
        context,
        'S4ServiceConfirmations',
        '',
        queryOptions,
        'confirmations_count',
        'confirmations_count_x_x',
    ).then(caption => {
        return context.getPageProxy().setCaption(caption);
    });
}
