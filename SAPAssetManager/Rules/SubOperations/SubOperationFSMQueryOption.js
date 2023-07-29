import PersonaLibrary from '../Persona/PersonaLibrary';

export default function SubOperationFSMQueryOption(context) {
    const filterValue = PersonaLibrary.getActivePersona(context);
    if (filterValue) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserObjectTypes', [], `$filter=Persona eq '${PersonaLibrary.getActivePersona(context)}' and Object eq 'ORI'`).then(types => {
            if (types && types.length > 0) {
                let typesQueryStrings = types.map(type => {
                    return `WorkOrderOperation/WOHeader/OrderType eq '${type.Type}'`;
                });

                return `(${typesQueryStrings.join(' or ')})`;
            }
            
            return '';
        }); 
    }
    return '';
}
