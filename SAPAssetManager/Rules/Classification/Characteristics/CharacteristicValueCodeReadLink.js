import ValueRel from './Update/CharacteristicUpdateValueRel';
export default function CharacteristicValueCodeReadLink(context) {
    return 'CharValueCodes(\'' + ValueRel(context) + '\')';

}
