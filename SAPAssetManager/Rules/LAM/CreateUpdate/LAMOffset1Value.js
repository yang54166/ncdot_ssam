import LAMValue from './LAMValue';

export default function LAMOffset1Value(context) {
    return LAMValue(context, context.evaluateTargetPath('#Control:Offset1/#Value'));
}
