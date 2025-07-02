export default function labelAnimation() {
	const inputWrappers = document.querySelectorAll('.auth-form__input-wrapper');

	inputWrappers.forEach((wrapper) => {
		const input = wrapper.querySelector('.auth-form__input-target');
		if (!input) {
			throw new Error('input not found into wrapper');
		}

		input.addEventListener('input', function (event) {
			console.log('input');
			checkInput(event.target, wrapper);
		});

		checkInput(input, wrapper);

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
		input.selected ||
		window.getComputedStyle(input, null).getPropertyValue('appearance') ===
			'menulist-button'
	) {
		wrapper.classList.add('active');
	} else {
		wrapper.classList.remove('active');
	}
}
