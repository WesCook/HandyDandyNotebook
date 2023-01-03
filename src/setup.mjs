export async function setup({ loadModule, settings, onInterfaceReady }) {
	// Modules
	const Button = await loadModule("button.mjs");
	const { openNotebook } = await loadModule("notebook.mjs");

	// Settings
	createSettings(settings, Button, openNotebook);

	// Interface Setup
	onInterfaceReady(ctx => {
		createIconCSS(ctx);
		Button.placeNotebookButton(openNotebook);
	});
}

function createSettings(settings, Button, openNotebook) {
	const sectionInterface = settings.section("Interface");

	// Button Position
	sectionInterface.add({
		type: "dropdown",
		name: "button-position",
		label: "Button Position",
		default: "topbar",
		onChange: newValue => {
			Button.placeNotebookButton(openNotebook, newValue);
		},
		options: [
			{ value: "topbar", display: "Top Bar" },
			{ value: "minibar", display: "Minibar" },
			{ value: "sidebar", display: "Sidebar" }
		],
		hint: "Where notebook button is placed in interface.",
	});

	// Scroll Position
	sectionInterface.add({
		type: "dropdown",
		name: "scroll-position",
		label: "Scroll Position",
		default: "top",
		options: [
			{ value: "top", display: "Top" },
			{ value: "bottom", display: "Bottom" }
		],
		hint: "Scroll to top or bottom of notebook when opening.",
	});

	// Show Animations
	sectionInterface.add({
		type: "switch",
		name: "show-animations",
		label: "Show Animations",
		hint: "Show popup and leave animations.  Disable to improve performance on low-powered devices.",
		default: true
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
