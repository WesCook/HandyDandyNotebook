// Open notebook modal
export function openNotebook() {
	// Get notebook data and reset if undefined
	const ctx = mod.getContext(import.meta);
	let notebookText = ctx.characterStorage.getItem("notebook"); // Load from character
	if (notebookText === undefined) {
		notebookText = "";
		ctx.characterStorage.setItem("notebook", "");
	}

	// Set up modal
	let props = {
		title: "Handy Dandy Notebook",
		input: "textarea",
		inputValue: notebookText,
		showCloseButton: true,
		showConfirmButton: false,
		allowEnterKey: false,
		customClass: { container: "notebook-modal" },
		didOpen: () => {
			document.querySelector(".notebook-modal textarea").focus();
		}
	};

	// Conditionally disable animations
	const sectionInterface = ctx.settings.section("Interface");
	const showAnimations = sectionInterface.get("show-animations");
	if (!showAnimations) {
		props.showClass = {popup: ""};
		props.hideClass = {popup: ""};
	}

	// Trigger modal dialogue with notebook textarea and save result to character
	Swal.fire(props).then(() => {
		ctx.characterStorage.setItem("notebook", Swal.getInput().value);
	});
}
