// Open notebook modal via Swal2 library
export function openModal() {
	// Get notebook data and reset if undefined
	const ctx = mod.getContext(import.meta);
	let notebookText = ctx.characterStorage.getItem("notebook"); // Load from character
	if (notebookText === undefined) {
		notebookText = "";
		ctx.characterStorage.setItem("notebook", "");
	}

	// Read in settings
	const sectionInterface = ctx.settings.section("Interface");
	const scrollPosition = sectionInterface.get("scroll-position");
	const showAnimations = sectionInterface.get("show-animations");

	// Set up modal with textarea
	let props = {
		title: "Handy Dandy Notebook",
		input: "textarea",
		inputValue: notebookText,
		showCloseButton: true,
		showConfirmButton: false,
		allowEnterKey: false,
		inputAttributes: {
			maxlength: 7800,
		},
		customClass: {
			container: "notebook-modal",
			footer: "notebook-warning"
		},
		footer: "&nbsp;", // Valid character just to have it appear
		didOpen: () => {
			// Focus textarea on opening
			const notebookTextarea = Swal.getInput();
			notebookTextarea.focus();

			// Set scroll position to top if needed (defaults to bottom)
			if (scrollPosition === "top") {
				notebookTextarea.setSelectionRange(0, 0);
				notebookTextarea.scrollTop = 0;
			}

			// Init
			let notebookData = notebookTextarea.value;
			const footerNode = document.querySelector(".notebook-warning");
			const encoder = new TextEncoder();

			// Warn when close to limit (8KB, with a small amount of headroom)
			const checkLengthAndUpdate = () => {
				const currentBytes = encoder.encode(notebookData).byteLength;
				if (currentBytes > 7300 && currentBytes < 7800) {
					footerNode.style.display = "flex";
					footerNode.dataset.warning = "approaching";
				} else if (currentBytes >= 7800) {
					footerNode.style.display = "flex";
					footerNode.dataset.warning = "limit-reached";
				} else {
					footerNode.style.display = "none";
					footerNode.dataset.warning = "";
				}
			};
			checkLengthAndUpdate();

			// On text change
			Swal.getInput().addEventListener("input", () => {
				// Update text and check again
				notebookData = notebookTextarea.value;
				checkLengthAndUpdate();

				// Save to character
				try {
					ctx.characterStorage.setItem("notebook", notebookData);
				}
				catch(error) {
					console.error("Cannot save notebook data.  Likely exceeded 8KB character storage limit.");
				}
			})
		}
	};

	// Conditionally disable animations
	if (!showAnimations) {
		props.showClass = {popup: ""};
		props.hideClass = {popup: ""};
	}

	// Trigger modal
	Swal.fire(props);
}
