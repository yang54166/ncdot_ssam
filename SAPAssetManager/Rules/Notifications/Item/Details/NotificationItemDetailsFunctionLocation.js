import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function NotificationItemDetailsFunctionLocation(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.ItemFunctionLocation);
}
