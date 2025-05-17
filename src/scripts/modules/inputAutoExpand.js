export default function (selector, defaultRow = 1) {
	const inputNodes = document.querySelectorAll(selector);

	inputNodes.forEach((input) => {
		input.rows = defaultRow;
		setDefaultStyles(input);
		input.addEventListener('input', inputHandler);
	});

	function inputHandler() {
		this.style.height = 'auto';
		this.style.height = `${this.scrollHeight}px`;
	}

	function setDefaultStyles(elNode) {
		elNode.style.overflow = 'hidden';
		elNode.style.resize = 'none';
	}
}
