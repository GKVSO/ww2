export default function labelAnimation() {
	const inputWrappers = document.querySelectorAll('.auth-form__input-wrapper');

	inputWrappers.forEach((wrapper) => {
		const input = wrapper.querySelector('input');

		input.addEventListener('input', function (event) {
			checkInput(event.target, wrapper);
		});

		input.addEventListener('animationstart', function (event) {
			if (event.animationName === 'onAutoFillStart') {
				wrapper.classList.add('active');
				console.log('autofill animation start');
			}
		});
	});
}

function checkInput(input, wrapper) {
	if (
		input.value.length !== 0 ||
		window.getComputedStyle(input, null).getPropertyValue('appearance') ===
			'menulist-button'
	) {
		wrapper.classList.add('active');
	}
}
