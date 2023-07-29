import checkListCount from './FunctionalLocationChecklistsCount';
import allowCreate from './AllowChecklistCreateFunctionalLocation';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function FunctionalLocationDetailsShowChecklists(context) {

    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/IAMChecklist.global').getValue())) { //Checklists are enabled in backend
        return checkListCount(context).then(count => {
            return allowCreate(context).then(value => {
                if (count > 0 || value) { //Checklists exist for this functional location, or master data exists for creating new checklists
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            });
        });
    }
    return Promise.resolve(false);
}
