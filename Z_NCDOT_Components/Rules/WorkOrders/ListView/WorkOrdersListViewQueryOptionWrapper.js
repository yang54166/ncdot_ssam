import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import PersonaLibrary from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../../../../SAPAssetManager/Rules/WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrdersListViewQueryOption from './WorkOrdersListViewQueryOption';
import { WorkOrderLibrary } from '../WorkOrderLibrary';

export default function WorkOrdersListViewQueryOptionWrapper(clientAPI) {
    if (PersonaLibrary.isFieldServiceTechnician(clientAPI)) {
        return WorkOrdersFSMQueryOption(clientAPI).then(fsmQueryOptions => {
            let queryOptions = WorkOrdersListViewQueryOption(clientAPI);
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            return queryOptions;
        });
    } else {
        const queryBuilder = WorkOrdersListViewQueryOption(clientAPI);
        if (PersonaLibrary.isWCMOperator(clientAPI)) {
            const filterWCM = WorkOrderLibrary.getWCMWorkOrdersFilter();
            if (queryBuilder.hasFilter) {
                queryBuilder.filter().and(filterWCM);
            } else {
                queryBuilder.filter(filterWCM);
            }
        }
        return queryBuilder;
    }
}
