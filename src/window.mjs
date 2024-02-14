let elemWindow;
let elemTitlebar;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let notebookX;
let notebookY;

let mouseX = 0;
let mouseY = 0;
let mouseOffsetX = 0;
let mouseOffsetY = 0;
let canUpdateMousePos = false;

export function toggleWindow() {
	elemWindow.style.display = (elemWindow.style.display === "block") ? "none" : "block";
	document.querySelector("#notebook-window textarea").focus();
}

export function createWindow() {
	// Create DOM node
	const windowTemplate = () => ({
		$template: "#template-notebook-window"
	});
	ui.create(windowTemplate(), document.body);

	// Update local reference
	elemWindow = document.getElementById("notebook-window");
	elemTitlebar = document.getElementById("notebook-titlebar");
	if (!elemWindow || !elemTitlebar) {
		console.error("Notebook window was not instantiated");
	}

	// Get initial x/y pos from style
	let styles = getComputedStyle(elemWindow);
	let matrix = new DOMMatrix(styles.transform);
	notebookX = matrix.e || 0; // translateX() value
	notebookY = matrix.f || 0; // translateY() value
}

export function setupEventListeners() {
	document.addEventListener("dragover", eventListenAllowDragging);
	elemTitlebar.addEventListener("dragstart", titlebarStartDrag);
	elemTitlebar.addEventListener("dragend", titlebarEndDrag);
	elemTitlebar.addEventListener("drag", titlebarDragging);
	window.addEventListener("resize", browserResize);
}

export function destroyEventListeners() {
	document.removeEventListener("dragover", eventListenAllowDragging);
	elemTitlebar?.removeEventListener("dragstart", titlebarStartDrag);
	elemTitlebar?.removeEventListener("dragend", titlebarEndDrag);
	elemTitlebar?.removeEventListener("drag", titlebarDragging);
	window.removeEventListener("resize", browserResize);
}


/////////////////////
// Event listeners //
/////////////////////

// Allow dragging anywhere on document
function eventListenAllowDragging(event) {
	canUpdateMousePos = true;

	// Update mouse positions
	// Workaround for Firefox, else we could just access clientX in drag event
	// https://bugzilla.mozilla.org/show_bug.cgi?id=505521
	mouseX = event.clientX;
	mouseY = event.clientY;

	// Allow dragging anywhere on document
	event.preventDefault();
	return false;
}

function titlebarStartDrag(event) {
	// Set drag class
	elemWindow.classList.add("drag");

	// Update offset to grab coordinates
	mouseOffsetX = event.clientX - notebookX;
	mouseOffsetY = event.clientY - notebookY;

	// Hide translucent draggable preview
	event.dataTransfer.setDragImage(new Image(), 0, 0);

	// Update cursor icon
	event.dataTransfer.effectAllowed = "move";
}

function titlebarEndDrag() {
	canUpdateMousePos = false;
	elemWindow.classList.remove("drag");
}

// Update notebook position
function titlebarDragging(event) {
	// The `drag` event fires before `dragover`, so there's one frame where the update tries to use the old mouse position
	// This variable prevents the update from running until `dragover` has had a chance to update the mouse position
	// Mostly needed for Firefox, as other browsers produce usable mouse coordinates in this `drag` event
	if (!canUpdateMousePos) {
		return;
	}

	// If mouse position is available in event, use it rather than dragover event
	if (event.clientX !== 0 && event.clientY !== 0) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}

	// Both values being zero likely means it was dragged offscreen, so ignore update
	if (mouseX === 0 && mouseY === 0) {
		return;
	}

	// Calculate and update position
	notebookX = clamp(0, mouseX - mouseOffsetX, document.documentElement.clientWidth - elemWindow.offsetWidth);
	notebookY = clamp(0, mouseY - mouseOffsetY, document.documentElement.clientHeight - elemWindow.offsetHeight);
	elemWindow.style.transform = `translate(${notebookX}px, ${notebookY}px)`;
}

// Constrain to document if window size changes
// Note: Chrome dev tools will sometimes be invisible when "restoring down" the window.  Expanding the window will have it reappear, but in the meantime the page's scrollWidth/Height is set very low, resulting in the notebook appearing at the edge of the window.
function browserResize(event) {
	notebookX = clamp(0, notebookX, document.documentElement.clientWidth - elemWindow.offsetWidth);
	notebookY = clamp(0, notebookY, document.documentElement.clientHeight - elemWindow.offsetHeight);
	elemWindow.style.transform = `translate(${notebookX}px, ${notebookY}px)`;
}




/*
TODO:
- Length warning
- Save every character
- Save position, or lose it per-refresh?
- Add a Handy Dandy Notebook skin
*/
