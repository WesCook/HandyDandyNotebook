// Create and place notebook button based on user setting
// Function is called again when user changes setting
// Accepts callback to run when clicked
export function placeNotebookButton(cb) {
	const ctx = mod.getContext(import.meta);
	const sectionInterface = ctx.settings.section("Interface");
	const buttonPosition = sectionInterface.get("button-position");

	switch (buttonPosition) {
		case "topbar": placeButtonInTopbar(cb); break;
		case "minibar": placeButtonInMinibar(cb); break;
		case "sidebar": placeButtonInSidebar(cb); break;
		default: console.error("Invalid notebook button position"); break;
	}
}

function placeButtonInTopbar(cb) {
	// Remove sidebar entry if it exists
	sidebar.category("Modding").item("Handy Dandy Notebook").remove();

	// Recreate notebook button from template
	let notebook = document.getElementById("notebook");
	if (notebook) {
		notebook.remove();
	}
	ui.create(NotebookButton("#notebook-button-topbar", cb), document.body);
	notebook = document.getElementById("notebook");

	// Insert into position
	// ui.create() lets us choose a parent, but not placement between elements
	const potions = document.getElementById("page-header-potions-dropdown").parentNode;
	potions.insertAdjacentElement("beforebegin", notebook);
}

function placeButtonInMinibar(cb) {
	// Remove sidebar entry if it exists
	sidebar.category("Modding").item("Handy Dandy Notebook").remove();

	// Recreate notebook button from template
	let notebook = document.getElementById("notebook");
	if (notebook) {
		notebook.remove();
	}
	ui.create(NotebookButton("#notebook-button-minibar", cb), document.body);
	notebook = document.getElementById("notebook");

	// Insert into position
	const minibar = document.getElementById("skill-footer-minibar");
	minibar.appendChild(notebook);
}

function placeButtonInSidebar(cb) {
	// Destroy button
	const notebook = document.getElementById("notebook");
	if (notebook) {
		notebook.remove()
	}

	// Add sidebar
	const ctx = mod.getContext(import.meta);
	sidebar.category("Modding").item("Handy Dandy Notebook", {
		nameClass: "notebook-sidebar",
		icon: ctx.getResourceUrl("assets/notebook-icon-dark.png"),
		onClick: cb
	});
}

// Create button from template
function NotebookButton(template, cb) {
	return {
		$template: template,
		clickedButton() {
			document.getElementById("notebook").blur(); // Remove focus from button for visuals
			if (typeof cb === "function") {
				cb();
			}
		}
	};
}
