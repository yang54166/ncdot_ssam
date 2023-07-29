export default function ShowSelectedText(context) {
	let icons = [];
	
	let pageData = context.getPageProxy().getClientData();
	let selectedItems = pageData.selectedItems;
	
	if (selectedItems && selectedItems.includes(context.binding.ProductId)) {
		return 'X';
	}
	return 'O';
}
