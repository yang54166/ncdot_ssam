import LoadPersonaOverview from '../Persona/LoadPersonaOverview';
import libPersona from '../Persona/PersonaLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libLoc from '../LocationTracking/LocationTrackingLibrary';
import isAndroid from '../Common/IsAndroid';

export default function OverviewUserPersona(context) {
    try {
        var switchPersonaLstPkrControl;
        var dict = libCom.getControlDictionaryFromPage(context);
        var logger = context.getLogger();

        if (dict && dict.SwitchPersonaLstPkr) {
            switchPersonaLstPkrControl = dict.SwitchPersonaLstPkr;
            var listPickerValue = switchPersonaLstPkrControl.getValue()[0].ReturnValue;
            if (libCom.getStateVariable(context, 'currentPersona', 'UserProfileSettings') !== listPickerValue) {
                if (isAndroid(context)) {
                    // Clear cache settings in map before switching persona for Android lifecycle
                    const mapControl = getMapControlInOverViewPage(context);
                    if (libCom.isDefined(mapControl)) {
                        const mapExtension = mapControl.getExtensions()[0];
                        if (libCom.isDefined(mapExtension)) {
                            mapExtension.clearUserDefaults();
                        }
                    }
                }
                libCom.removeStateVariable(context, 'currentPersona', 'UserProfileSettings');
                libPersona.setActivePersona(context, listPickerValue);

                return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
                    let activityIndicatorId = context.showActivityIndicator(context.localizeText('switching_persona'));
                    return LoadPersonaOverview(context).then(() => {
                        context.dismissActivityIndicator(activityIndicatorId);
                        // Reload the sectioned table on the persona overview
                        let sectionedTable = getSectionedTableOnOverviewPage(context);
                        
                        if (libCom.isDefined(sectionedTable)) {
                            sectionedTable.redraw();
                        }
                        // Reinitialize location tracking service
                        return libLoc.initService(context);
                    });
                });
            }
            libCom.removeStateVariable(context, 'currentPersona', 'UserProfileSettings');
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        }
    } catch (exception) {
        logger.log(String(exception), 'Error');
        return undefined;
    }
}

function getMapControlInOverViewPage(context) {
    let section = getSectionedTableOnOverviewPage(context);
    if (libCom.isDefined(section)) {
        const control = section.getSections().find(function(sec) {
            return libCom.isDefined(sec.getName()) && sec.getName().includes('MapExtensionSection');
        });
        return control;
    } else {
        return undefined;
    }
}

function getSectionedTableOnOverviewPage(context) {
    let overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
    let overviewPage = context.evaluateTargetPathForAPI('#Page:' + overviewPageName);
    if (overviewPage && overviewPage.getControls().length > 0) {
        return overviewPage.getControls()[0];
    } else {
        return undefined;
    }
}
