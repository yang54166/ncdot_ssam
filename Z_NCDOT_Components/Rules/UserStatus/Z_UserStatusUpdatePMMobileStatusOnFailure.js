//import libCommon from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function Z_UserStatusUpdatePMMobileStatusOnFailure(context) {

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
        'Properties': {
            'Title': '$(L,invalidStatusTitle)',
            'Message': '$(L,invalidStatusMsg)',
            'CancelCaption': '$(L,cancel)',
        },
    });
}
