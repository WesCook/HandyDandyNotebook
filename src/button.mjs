// Create and place notebook button based on user setting
// Function is called again when user changes setting
// Accepts callback to run when clicked
export function placeNotebookButton(cb, newValue) {
	cleanupUI();

	// Get notebook button position
	let buttonPosition;
	if (newValue) { // If receiving update from settings change callback
		buttonPosition = newValue;
	} else { // Otherwise fall back to saved value
		const ctx = mod.getContext(import.meta);
		const sectionInterface = ctx.settings.section("Interface");
		buttonPosition = sectionInterface.get("button-position");
	}

	switch (buttonPosition) {
		case "topbar": placeButtonInTopbar(cb); break;
		case "minibar": placeButtonInMinibar(cb); break;
		case "sidebar": placeButtonInSidebar(cb); break;
		default: console.error("Invalid notebook button position"); break;
	}
}

// Remove old buttons, tooltips, and sidebar entries
function cleanupUI() {
	const notebook = document.getElementById("notebook");

	// Destroy tooltip if it exists
	if (notebook && notebook._tippy) {
		notebook._tippy.destroy();
	}

	// Delete node
	if (notebook) {
		notebook.remove();
	}

	// Remove sidebar entry if it exists
	sidebar.category("Modding").item("Handy Dandy Notebook").remove();
}

function placeButtonInTopbar(cb) {
	// Create notebook button
	ui.create(NotebookButton("#notebook-button-topbar", cb), document.body);
	const notebook = document.getElementById("notebook");

	// Insert into position
	// ui.create() lets us choose a parent, but not placement between elements
	const potions = document.getElementById("page-header-potions-dropdown").parentNode;
	potions.insertAdjacentElement("beforebegin", notebook);
}

function placeButtonInMinibar(cb) {
	// Create notebook button
	ui.create(NotebookButton("#notebook-button-minibar", cb), document.body);
	const notebook = document.getElementById("notebook");

	// Insert into position
	const minibar = document.getElementById("skill-footer-minibar");
	minibar.appendChild(notebook);

	// Create tooltip
	tippy("#notebook.minibar", {
		content: "<div class='text-center'><small>Handy Dandy Notebook</small></div>",
		allowHTML: true,
		placement: "left",
		duration: [0, 0]
	});
}

function placeButtonInSidebar(cb) {
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
			// Remove focus from button for visuals
			document.getElementById("notebook").blur();

			// Run callback, which is likely openNotebook()
			if (typeof cb === "function") {
				cb();
			}
		}
	};
}
