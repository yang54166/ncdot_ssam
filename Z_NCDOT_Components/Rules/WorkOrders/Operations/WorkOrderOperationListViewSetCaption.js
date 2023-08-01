import queryOptions from './WorkOrderOperationsListViewQueryOption';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import IsOperationLevelAssigmentType from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/IsOperationLevelAssigmentType';
import libSuper from '../../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import libPersona from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import WorkOrderOperationsListGetTypesQueryOption from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationsListGetTypesQueryOption';
import { OperationLibrary } from './WorkOrderOperationLibrary';

export default function WorkOrderOperationListViewSetCaption(context) {

    var entitySet;
    var queryOption = '';
    var totalQueryOption = '';
    var localizeText;
    var localizeText_x_x;    
    var parameters = CommonLibrary.getStateVariable(context,'OPERATIONS_FILTER');

    return WorkOrderOperationsListGetTypesQueryOption(context).then(typesQueryOptions => {
        if (!libVal.evalIsEmpty(parameters)) {
            entitySet = parameters.entity;
            queryOption = parameters.query;
            localizeText = parameters.localizeTextX;
            localizeText_x_x = parameters.localizeTextXX;
        } else {
            if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding['@odata.type'])) {
                switch (context.binding['@odata.type']) {
                    case '#sap_mobile.MyWorkOrderHeader':
                        entitySet = context.binding['@odata.readLink'] + '/Operations';
                        queryOption = queryOptions(context);
                        localizeText = 'operations_x';
                        localizeText_x_x = 'operations_x_x';
                        break;
                    default:
                        break;
                }
            } else {
                entitySet = 'MyWorkOrderOperations';
                localizeText = 'operations_x';
                localizeText_x_x = 'operations_x_x';
                if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isSupervisorOperationsList)) {
                    queryOption = libSuper.getFilterForOperationPendingReview(context, false);
                } else if ((libSuper.isSupervisorFeatureEnabled(context)) && CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isTechnicianOperationsList)) {
                    queryOption = libSuper.getFilterForSubmittedOperation(context, false);
                } else if (IsOperationLevelAssigmentType(context)) {
                    queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
                } else if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
                    entitySet = 'MyWorkOrderSubOperations';
                    queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
                    localizeText = 'suboperations_x';
                    localizeText_x_x = 'suboperations_x_x';
                }
            }
        }

        let additionalFilter = '';

        if (libPersona.isFieldServiceTechnician(context) && !libVal.evalIsEmpty(typesQueryOptions)) {
            additionalFilter = typesQueryOptions;
        }

        const countFilter = OperationLibrary.getOperationsFilterByAssgnTypeOrWCM(context);

        if (countFilter) {
            additionalFilter = additionalFilter ? `${additionalFilter} and ${countFilter}` : countFilter;
        }

        if (additionalFilter) {
            totalQueryOption = '$filter=' + additionalFilter;

            let queryOptionSplitted = queryOption.split('&');
            let filterIndex = queryOptionSplitted.findIndex(el => el.includes('$filter='));

            if (filterIndex !== -1) {
                queryOptionSplitted[filterIndex] += ' and ' + additionalFilter;
            } else {
                queryOptionSplitted.push('$filter=' + additionalFilter);
            }

            queryOption = queryOptionSplitted.join('&');
        }
        //hlf - here
       
        if (CommonLibrary.getStateVariable(context, 'FromOperationsAssignedList')) {
            let personNbr = CommonLibrary.getPersonnelNumber();
            // get prabha number
            personNbr = '01555611';
            localizeText = 'ZAssignoperations_x';
            localizeText_x_x = 'ZAssignoperations_x_x';
    
            queryOption = queryOption + "and PersonNum eq '" + personNbr + "'";
        }

        var params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, totalQueryOption);
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);

        return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
            let totalCount = resultsArray[0];
            let count = resultsArray[1];
            let caption;
            params.push(count);
            params.push(totalCount);
            if (count === totalCount) {
                caption = context.localizeText(localizeText, [totalCount]);
            } else {
                caption = context.localizeText(localizeText_x_x, params);
            }
            context.getClientData().PageCaption = caption;
            return context.setCaption(caption);
        });
    });
}
