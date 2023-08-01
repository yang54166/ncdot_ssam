export default function showSelected(context) {
	let icons = [];
	
	let pageData = context.getPageProxy().getClientData();
	let selectedItems = pageData.selectedItems;
	
	if (selectedItems && selectedItems.includes(context.binding.ProductId)) {
		return '/MDKDemoApp/Images/iOS/selected60.png';
	}
	return '/MDKDemoApp/Images/iOS/unselected60.png';
}