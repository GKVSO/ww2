export default function labelAnimation() {
	const inputWrappers = document.querySelectorAll('.auth-form__input-wrapper');

	inputWrappers.forEach((wrapper) => {
		const input = wrapper.querySelector('input');

		input.addEventListener('input', function (event) {
			checkInput(event.target, wrapper);
		});

		// Проверяем автозаполнение
		window.addEventListener('load', function (event) {
			this.setTimeout(() => {
				checkInput(input, wrapper);
			}, 300);
		});
	});
}

function checkInput(input, wrapper) {
	if (
		input.value.length === 0 &&
		window.getComputedStyle(input, null).getPropertyValue('appearance') !==
			'menulist-button'
	) {
		wrapper.classList.remove('active');
	} else {
		wrapper.classList.add('active');
	}
}
