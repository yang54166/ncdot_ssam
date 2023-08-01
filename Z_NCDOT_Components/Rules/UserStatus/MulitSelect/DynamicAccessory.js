export default function DynamicAccessory(context) {
	let pageData = context.getPageProxy().getClientData();
	let selectedItems = pageData.selectedItems;
	
	if (selectedItems && selectedItems.includes(context.binding.EmployeeID)) {
		return 'checkmark';
	}
	return 'none';
}