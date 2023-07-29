import Z_OperationDisplayStartedOpId from './Z_OperationDisplayStartedOpId';

export default function Z_OperationFormatCurrentStatusCaption(context) {
    let caption = 'Currently you have no operation in process';

    return Z_OperationDisplayStartedOpId(context).then(result => {
        if (result){
            caption = 'Your current operation in Progress: '
        }
        return caption;
    })
    
}
