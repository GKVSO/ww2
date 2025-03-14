export default function labelAnimation() {
	const inputWrappers = document.querySelectorAll('.auth-form__input-wrapper');

	inputWrappers.forEach((wrapper) => {
		const input = wrapper.querySelector('input');

		checkInput(input, wrapper);

		input.addEventListener('input', function (event) {
			checkInput(event.target, wrapper);
		});
	});
}

function checkInput(input, wrapper) {
	if (input.value.length === 0) {
		wrapper.classList.remove('active');
	} else {
		wrapper.classList.add('active');
	}
}
