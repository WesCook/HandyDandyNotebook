export async function setup({ loadModule, settings, onInterfaceReady }) {
	// Modules
	const Button = await loadModule("button.mjs");
	const { openNotebook } = await loadModule("notebook.mjs");

	// Settings
	createSettings(settings, Button, openNotebook);

	// Interface Setup
	onInterfaceReady(ctx => {
		createIconCSS(ctx);
		//Button.placeNotebookButton(openNotebook); // Setting callback actually fires on mod load, so there's no need to call initially right now
	});
}

function createSettings(settings, Button, openNotebook) {
	const sectionInterface = settings.section("Interface");
	sectionInterface.add({
		type: "dropdown",
		name: "button-position",
		label: "Notebook Button Position",
		default: "topbar",
		onChange: () => {
			// TODO: This is being called prematurely.  The setting hasn't updated yet when it's called.
			Button.placeNotebookButton(openNotebook);
		},
		options: [
			{ value: "topbar", display: "Top Bar" },
			{ value: "minibar", display: "Minibar" },
			{ value: "sidebar", display: "Sidebar" }
		]
	});
}

// Making icon available for CSS
// Uses custom properties which are resolved to their blob URIs here,
// then set as the background image in styles.css.  Not my first choice
// of implementation, but <picture> tags can't change their source based
// on selectors (in this case body.darkMode), and data attributes are
// out because attr() doesn't work with url() objects until CSS level 5.
function createIconCSS(ctx) {
	document.head.insertAdjacentHTML("beforeend",
	`<style>
	.notebook {
		--icon-light: url("${ctx.getResourceUrl("assets/notebook-icon-light.png")}");
		--icon-dark: url("${ctx.getResourceUrl("assets/notebook-icon-dark.png")}");
	}
	</style>`);
}
