import SafetyCertificatesLibrary from './SafetyCertificatesLibrary';

export default function LOTOCertificatesCount(context) {
    return SafetyCertificatesLibrary.getCertificatesCount(context, SafetyCertificatesLibrary.typeLOTO);
}
