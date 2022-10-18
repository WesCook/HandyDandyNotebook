export function setup({ onCharacterLoaded, onInterfaceReady }) {
	onCharacterLoaded(ctx => {
		console.log("Character is loaded");
	})

	onInterfaceReady(ctx => {
		ui.create(
			NotebookButton({ iconPath: ctx.getResourceUrl('assets/notebook-icon.png') }), document.getElementById('page-header-user-dropdown').parentNode.parentNode
		);
	});
}

function NotebookButton(props) {
	return {
		$template: '#notebook-button',
		iconPath: props.iconPath,
		openNotebook() {
			console.log("Button clicked!");
		}
	};
}
