import commonlib from '../Common/Library/CommonLibrary';
import S4RelatedHistoryEntitySet from './S4RelatedHistoryEntitySet';

export default function S4RelatedServiceConfirmationsCount(context) {
    const readLink = S4RelatedHistoryEntitySet(context);

    return commonlib.getEntitySetCount(context, readLink + '/S4ConfirmationRefObjHistory_Nav', '');
}
