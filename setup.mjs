export function setup({ onInterfaceReady }) {
	onInterfaceReady(ctx => {
		// Making icon available for CSS
		// Uses custom properties which are resolved to their blob URIs here,
		// then set as the background image in styles.css.  Not my first choice
		// of implementation, but <picture> tags can't change their source based
		// on selectors (in this case body.darkMode), and data attributes are
		// out because attr() doesn't work with url() objects until CSS level 5.
		document.head.insertAdjacentHTML("beforeend", `<style>
		.notebook {
			--icon-light: url("${ctx.getResourceUrl("assets/notebook-icon-light.png")} ");
			--icon-dark: url("${ctx.getResourceUrl("assets/notebook-icon-dark.png")}");
		}
		</style>`);

		// Create notebook button
		ui.create(NotebookButton(), document.body);

		// Move element into more favourable position
		// ui.create() lets us choose a parent, but not placement between elements
		let target = document.getElementById("page-header-potions-dropdown").parentNode;
		let notebook = document.getElementById("notebook");
		target.insertAdjacentElement("beforebegin", notebook);
	});
}

function NotebookButton() {
	return {
		$template: '#notebook-button',
		openNotebook() {
			// Remove focus from button for visuals
			document.getElementById("notebook").blur();

			// Trigger modal dialogue with notebook textarea
			Swal.fire({
				title: "Handy Dandy Notebook",
				html: "<textarea id='notebook-textarea' class='notebook-textarea'></textarea>",
				showCloseButton: true,
				showConfirmButton: false,
				focusConfirm: false,
				allowEnterKey: false,
				width: "800px",
				didOpen: () => {
					document.getElementById("notebook-textarea").focus()
				}
			}).then(result => {
				console.log("Save data");
			});
		}
	};
}
