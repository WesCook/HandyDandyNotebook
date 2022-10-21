// Open notebook modal
export function openNotebook() {
	// Get notebook data
	const ctx = mod.getContext(import.meta);
	let notebookText = ctx.characterStorage.getItem("notebook"); // Load from character
	if (notebookText === undefined) { // No data found, so let's initialize it
		notebookText = "";
		ctx.characterStorage.setItem("notebook", "");
	}

	// Trigger modal dialogue with notebook textarea
	Swal.fire({
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
	}).then(() => {
		ctx.characterStorage.setItem("notebook", Swal.getInput().value); // Save to character
	});
}
