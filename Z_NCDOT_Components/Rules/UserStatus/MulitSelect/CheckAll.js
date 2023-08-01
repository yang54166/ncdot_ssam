export default function CheckAll(context) {
	debugger;
	let pageData = context.getClientData();
	let items = pageData.selectedItems;
	if (!items) {
		items = [];
	}
	
	let sectionedTable = context.getControl('SectionedTable0');
	let binding = sectionedTable.getSections()[0].binding;
	binding.forEach(function(row) {
		if (!items.includes(row.EmployeeID)) {
			items.push(row.EmployeeID);
		}	
	});
	pageData.selectedItems = items;
	sectionedTable.redraw();
}