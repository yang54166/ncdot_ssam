export default function showSelected(context) {
	let icons = [];
	
	let pageData = context.getPageProxy().getClientData();
	let selectedItems = pageData.selectedItems;
	
	if (selectedItems && selectedItems.includes(context.binding.ProductId)) {
		return true;
	}
	return false;
}