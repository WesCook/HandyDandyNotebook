export function setup({ onCharacterLoaded, onInterfaceReady }) {
	onCharacterLoaded(ctx => {
		let version = 1;
		console.log("Handy Dandy Notebook : v" + version);
	})

	onInterfaceReady(ctx => {
		ui.create(NotebookButton({ iconPath: ctx.getResourceUrl('assets/notebook-icon.png') }), document.getElementById("page-header-user-dropdown").parentNode.parentNode);
		ui.create(NotebookModal(), document.getElementById("page-container"));
	});
}

function NotebookButton(props) {
	return {
		$template: '#notebook-button',
		iconPath: props.iconPath,
		openNotebook() {
			console.log("Button clicked!");
			document.body.classList.add("modal-open");
			let modal = document.getElementById("modal-notebook-window");
			modal.classList.add("show")
			modal.style.display = "block";
		}
	};
}

function NotebookModal() {
	return {
		$template: '#notebook-modal',
	};
}
