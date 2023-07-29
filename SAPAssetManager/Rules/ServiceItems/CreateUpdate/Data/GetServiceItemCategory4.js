import CommonLibrary from '../../../Common/Library/CommonLibrary';
import nilGuid from '../../../Common/nilGuid';

export default function GetServiceItemCategory4(context) {
    let control = CommonLibrary.getControlProxy(context, 'Category4LstPkr');
    let value = CommonLibrary.getControlValue(control);

    return value || nilGuid();
}
