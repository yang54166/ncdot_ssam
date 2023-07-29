export default function showSelected(context) {
	let icons = [];
	
	let pageData = context.getPageProxy().getClientData();
	let selectedItems = pageData.selectedItems;
	
	if (selectedItems && selectedItems.includes(context.binding.ProductId)) {
		return 'sap-icon://sys-enter-2';
	}
	return '/MDKDemoApp/Images/iOS/unselected60.png';
}