export function setup({ onCharacterLoaded }) {
	console.log("Main game is loaded");

	onCharacterLoaded(ctx => {
		console.log("Character is loaded");
	})
}
