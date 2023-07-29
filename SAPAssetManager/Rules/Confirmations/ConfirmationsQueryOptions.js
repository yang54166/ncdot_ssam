import QueryBuilder from '../Common/Query/QueryBuilder';
import DateBounds from './ConfirmationDateBounds';
import CommonLibrary from '../Common/Library/CommonLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function ConfirmationsQueryOptions(context) {
    let binding = context.getBindingObject();
    let filter = '';
    const mileageActivityType = CommonLibrary.getMileageActivityType(context);
    const expenseActivityType = CommonLibrary.getExpenseActivityType(context);
    const assignmentTypeFilter = libWO.getWorkOrdersFilterByAssignmentType(context);

    let queryBuilder = new QueryBuilder();
    queryBuilder.addExpandStatement('Confirmations');
    queryBuilder.addExtra('orderby=OrderId desc');

    if ((binding !== undefined && binding.PostingDate !== undefined) || CommonLibrary.getStateVariable(context, 'ActualDate')) {
        let bounds = DateBounds(binding.PostingDate || CommonLibrary.getStateVariable(context, 'ActualDate'));
        let lowerBound = bounds[0];
        let upperBound = bounds[1];
        

        filter = "Confirmations/any(confirmation:confirmation/StartTimeStamp ge datetime'" + lowerBound + "' and confirmation/StartTimeStamp le datetime'" + upperBound + "')"; 

        queryBuilder.addFilter(filter);


    } else {
        queryBuilder.addFilter('Confirmations/any(confirmation:confirmation/OrderID ne null)');
        queryBuilder.addFilter('ActualDuration ne null');
    }

    if (mileageActivityType) {
        queryBuilder.addFilter(`Confirmations/any(confirmation:confirmation/ActivityType ne '${mileageActivityType}')`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`Confirmations/any(confirmation:confirmation/ActivityType ne '${expenseActivityType}')`);
    }

    if (assignmentTypeFilter) {
        queryBuilder.addFilter(assignmentTypeFilter);
    }

    if (PersonaLibrary.isFieldServiceTechnician(context)) { //Only take the FST confirmations into account
        return WorkOrdersFSMQueryOption(context).then(orderTypes => {
            if (!ValidationLibrary.evalIsEmpty(orderTypes)) {
                queryBuilder.addFilter(orderTypes);
            }

            return queryBuilder.build();
        });
    } else {
        return queryBuilder.build();
    }

}
