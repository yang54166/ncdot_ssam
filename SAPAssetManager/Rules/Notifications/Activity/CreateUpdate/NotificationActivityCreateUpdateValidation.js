import libNotif from '../../NotificationLibrary';

export default function NotificationActivityCreateUpdateValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libNotif.NotificationActivityCreateUpdateValidation(pageClientAPI).then(result => {
        return result;
    });
}
