export function setup({ onCharacterLoaded, onInterfaceReady }) {
	onCharacterLoaded(ctx => {
		let version = 3;
		console.log("Handy Dandy Notebook : v" + version);
	})

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

		ui.create(NotebookButton(), document.getElementById("page-header-user-dropdown").parentNode.parentNode);
	});
}

function NotebookButton() {
	return {
		$template: '#notebook-button',
		openNotebook() {
			document.getElementById("notebook").blur();
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
