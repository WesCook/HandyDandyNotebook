let NotebookButton;
let NotebookWindow;
let NotebookModal;

export async function setup({ loadModule, settings, onInterfaceReady }) {
	// Modules
	NotebookButton = await loadModule("button.mjs");
	NotebookWindow = await loadModule("window.mjs");
	NotebookModal = await loadModule("modal.mjs");

	// Settings
	createSettings(settings);

	// Interface Setup
	onInterfaceReady(ctx => {
		createIconCSS(ctx);
		windowSetupAndCleanup();
		NotebookButton.placeButton(launchNotebook);
	});
}

function createSettings(settings) {
	const sectionInterface = settings.section("Interface");

	// Preferred UI
	sectionInterface.add({
		type: "dropdown",
		name: "preferred-ui",
		label: "Preferred UI",
		default: "window",
		onChange: newValue => windowSetupAndCleanup(newValue),
		options: [
			{ value: "window", display: "Window" },
			{ value: "modal", display: "Modal" }
		],
		hint: "Display as draggable window or classic modal.",
	});

	// Button Position
	sectionInterface.add({
		type: "dropdown",
		name: "button-position",
		label: "Button Position",
		default: "topbar",
		onChange: newValue => NotebookButton.placeButton(launchNotebook, newValue),
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
		hint: "Show popup and leave animations on modal UI.  Disable to improve performance on low-powered devices.",
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
	.notebook-button {
		--icon-light: url("${ctx.getResourceUrl("assets/notebook-icon-light.png")}");
		--icon-dark: url("${ctx.getResourceUrl("assets/notebook-icon-dark.png")}");
	}
	</style>`);
}

function launchNotebook() {
	// Read in settings
	const ctx = mod.getContext(import.meta);
	const sectionInterface = ctx.settings.section("Interface");
	const preferredUI = sectionInterface.get("preferred-ui");

	// Launch appropriate type of window based on character setting
	if (preferredUI === "window") {
		NotebookWindow.toggleWindow();
	} else {
		NotebookModal.openModal();
	}
}

// Set up or destroy event listeners, based on preferred UI
// newValue is only populated when changing settings
function windowSetupAndCleanup(newValue) {
	// Get preferred UI
	let preferredUI;
	if (newValue) { // If receiving update from settings change callback
		preferredUI = newValue;
	} else { // Otherwise fall back to saved value
		const ctx = mod.getContext(import.meta);
		const sectionInterface = ctx.settings.section("Interface");
		preferredUI = sectionInterface.get("preferred-ui");
	}

	// First destroy any notebook DOM nodes or event listeners used during during character load or settings changes, since these are not cleaned up when switching characters
	// Then recreate them, if the preferred UI is window
	NotebookWindow.destroyEventListeners();
	document.getElementById("notebook-window")?.remove();
	if (preferredUI === "window") { // Then we create them if needed
		NotebookWindow.createWindow();
		NotebookWindow.setupEventListeners();
	}
}
