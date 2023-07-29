import S4ServiceLibrary from '../../S4ServiceLibrary';

export default function IsServiceRequestIsNotCompleted(context) {
    let binding = context.binding || {};
    return S4ServiceLibrary.isServiceObjectCompleted(context, binding, binding.MobileStatus_Nav).then(isCompleted => {
        return !isCompleted;
    });
}
