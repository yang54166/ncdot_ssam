export default function ClearAll(context) {
	let pageData = context.getClientData();
	
	pageData.selectedItems = [];
	
	const sectionedTable = context.getControl('SectionedTable0');
	sectionedTable.redraw();
}