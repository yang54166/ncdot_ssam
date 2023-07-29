import {DynamicPageGenerator} from '../../../FDC/DynamicPageGenerator';

export default async function MeterReadingSingleRegister(context) {

    const deviceInfo = await (function() {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Devices('${context.binding.EquipmentNum}')`, [], '').then(result => {
            const equipment = result.getItem(0);

            return {'SerialNumber' : equipment.Device, 'DeviceCategory': equipment.DeviceCategory};
        }).catch(() => {
            return {'SerialNumber' : '', 'DeviceCategory': ''};
        });
    })();

    const sectionData =
    [{
        'Controls':
        [{
            'Caption': '$(L,serial_number)',
            'IsEditable': false,
            'Value': deviceInfo.SerialNumber,
            '_Name': 'SerialNumber',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,device_category)',
            'IsEditable': false,
            'Value': deviceInfo.DeviceCategory,
            '_Name': 'DeviceCategory',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        }],
        '_Type': 'Section.Type.FormCell',
    },
    {
        'Target': {
            'EntitySet': '{{#Property:@odata.readLink}}/Device_Nav/PeriodicMeterReading_Nav',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/Meter/Reading/Periodic/MeterReadingQueryOptions.js',
        },
        'Controls':
        [{
            'Caption': '$(L,register)',
            'IsEditable': false,
            'Value': '{Register}',
            '_Name': 'RegisterNum',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,reading)',
            'IsEditable': true,
            'Value': '{MeterReadingRecorded}',
            'PlaceHolder': 'None',
            '_Name': 'ReadingValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingUpdateCaptionWrapper.js',
        },
        {
            'Caption': '$(L,date_time)',
            'IsEditable': true,
            'Mode': 'DateTime',
            'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            'DateTimeEntryMode': 'datetime',
            '_Name': 'ReadingTimeControl',
            '_Type': 'Control.Type.FormCell.DatePicker',
        },
        {
            'Caption': '$(L,set_usage_peak_time)',
            'IsEditable': true,
            'Value': '{UsagePeakTimeBool}',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/PeakUsageShowHideMultiple.js',
            '_Name': 'PeakTimeSwitch',
            '_Type': 'Control.Type.FormCell.Switch',
        },
        {
            'Caption': '$(L,usage_peak_time)',
            'IsEditable': true,
            'IsVisible': false,
            'Mode': 'DateTime',
            'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            'DateTimeEntryMode': 'datetime',
            'Value': '{DateMaxRead}',
            '_Name': 'PeakUsageTimeControl',
            '_Type': 'Control.Type.FormCell.DatePicker',
        },
        {
            'AllowMultipleSelection': false,
            'Caption': '$(L,note)',
            'IsEditable': true,
            'IsSelectedSectionEnabled': false,
            'Value': '{MeterReaderNote}',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/SkipMeterReading.js',
            'PickerItems': '/SAPAssetManager/Rules/Meter/Reading/ReadingNoteValues.js',
            '_Name': 'NotePicker',
            '_Type': 'Control.Type.FormCell.ListPicker',
            'IsPickerDismissedOnSelection': true,
            'IsSearchCancelledAfterSelection': true,
        },
        {
            'Caption': '$(L,warning_min_max)',
            'IsEditable': false,
            'Value': '{{#Property:MeterReadingLimit_Nav/#Property:WarningMinLimitChar}} - {{#Property:MeterReadingLimit_Nav/#Property:WarningMaxLimitChar}}',
            'IsVisible': '/SAPAssetManager/Rules/Meter/Reading/Periodic/WarningLimitsIsVisible.js',
            '_Name': 'WarningMinValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,error_min_max)',
            'IsEditable': false,
            'Value': '{{#Property:MeterReadingLimit_Nav/#Property:ErrorMinLimitChar}} - {{#Property:MeterReadingLimit_Nav/#Property:ErrorMaxLimitChar}}',
            'IsVisible': '/SAPAssetManager/Rules/Meter/Reading/Periodic/ErrorLimitsIsVisible.js',
            '_Name': 'ErrorMinValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Title': '$(L,discard)',
            'IsVisible': false,
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'PeriodicMeterReadings',
                        'ReadLink': '#Property:@odata.readLink',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/Meter/Reading/DiscardReading.js',
                },
            },
            '_Name': 'DiscardButton',
            '_Type': 'Control.Type.FormCell.Button',
            'Styles': {
                'Value': 'ObjectCellStyleRed',
            },
        }],
        '_Type': 'Section.Type.FormCell',
    }];

    const pageOverrides = {
        'OnLoaded': '/SAPAssetManager/Rules/Meter/Common/HideCancelOnPageLoad.js',
        'ActionBar':
        {
            'Items':
            [{
                'Position': 'left',
                'SystemItem': 'Cancel',
                'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
            },
            {
                'Position': 'right',
                'SystemItem': "$(PLT,'Done','')",
                'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                'OnPress': '/SAPAssetManager/Rules/Meter/CreateUpdate/Periodic/DeviceMeterReadingsCreateUpdate.js',
            }],
        },
    };
    let prevReadLink = context.evaluateTargetPath('#Page:-Previous/#Property:@odata.readLink');
    return context.read('/SAPAssetManager/Services/AssetManager.service', prevReadLink, [], '').then(function(result) {
        let binding = result.getItem(0);
        binding.FromSingleRegister = context.binding.RegisterNum || context.binding.Register;
		binding.readDate = context.binding.SchedMeterReadingDate;
		context.setActionBinding(binding);
		const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
		return generator.navToPage();
    });
}
