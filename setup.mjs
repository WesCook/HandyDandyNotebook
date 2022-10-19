export function setup({ onCharacterLoaded, onInterfaceReady }) {
	onCharacterLoaded(ctx => {
		let version = 2;
		console.log("Handy Dandy Notebook : v" + version);
	})

	onInterfaceReady(ctx => {
		ui.create(NotebookButton({ iconPath: ctx.getResourceUrl('assets/notebook-icon.png') }), document.getElementById("page-header-user-dropdown").parentNode.parentNode);
	});
}

function NotebookButton(props) {
	return {
		$template: '#notebook-button',
		iconPath: props.iconPath,
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
