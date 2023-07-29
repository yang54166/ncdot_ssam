import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function NotificationItemDetailsEquipment(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.ItemEquipment);
}
