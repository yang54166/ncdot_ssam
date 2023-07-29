import Z_OperationDisplayStartedOpId from './Z_OperationDisplayStartedOpId';

export default function Z_OperationFormatStatusStyle(context) {
    return Z_OperationDisplayStartedOpId(context).then(result => {
        if (result){
            return 'ZOPstart';
        }
        return 'ZOPFooter';
    })
    
}
