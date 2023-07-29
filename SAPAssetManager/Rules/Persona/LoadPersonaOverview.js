/**
* Describe this function...
* @param {IClientAPI} context
*/
import libPersona from './PersonaLibrary';
import Logger from '../Log/Logger';

export default function LoadPersonaOverview(context) {
    if (libPersona.isMaintenanceTechnician(context)) {
        return setPersonaMenuItem(context, 'OverviewMT');
    } else if (libPersona.isInventoryClerk(context)) {
        return setPersonaMenuItem(context, 'OverviewIC');
    } else if (libPersona.isFieldServiceTechnician(context)) {
        return setPersonaMenuItem(context, 'OverviewST');
    } else if (libPersona.isWCMOperator(context)) {
        return setPersonaMenuItem(context, 'OverviewWCM');
    } else {
        Logger.error('Persona', 'Invalid persona: ' + libPersona.getActivePersona(context) + ', cannot load persona based overview page');
    }
}

function setPersonaMenuItem(context, itemName) {
    let sleepTime = 750;
    Logger.info('Start redraw for ' + itemName);
    return context.getGlobalSideDrawerControlProxy().redraw().then(() => {
        return sleep(sleepTime).then(() => {
            context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName(itemName);
            return sleep(sleepTime).then(() => {
                Logger.info('Done redraw for ' + itemName);
                return Promise.resolve();
            });
            // return context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName(itemName).then(() => {
            //     return sleep(sleepTime).then(() => {
            //         Logger.info('Done redraw for ' + itemName);
            //         return Promise.resolve();
            //     });
            // });
        });
    });
}

function sleep(ms) {
    return (new Promise((resolve) => {
        Logger.info('Sleeping for ' + ms);
        setTimeout(function() {
            Logger.info('Done sleeping for ' + ms);
            resolve();
        }, ms);
    }));
}
