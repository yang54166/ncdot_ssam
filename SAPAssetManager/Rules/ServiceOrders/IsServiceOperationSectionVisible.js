import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsServiceOperationSectionVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context)) {
        return false;
    }

    return MobileStatusLibrary.isOperationStatusChangeable(context);
}
