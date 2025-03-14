export default function togglePass() {
	const passInputWrapper = document.querySelectorAll(
		'.auth-form__input-wrapper_pass'
	);

	passInputWrapper.forEach((inputWrapper) => {
		const input = inputWrapper.querySelector('input');
		const btnToggle = inputWrapper.querySelector('.toggle-password');

		btnToggle.addEventListener('click', function (event) {
			console.log('click');
			event.preventDefault();
			this.classList.toggle('active');

			if (this.classList.contains('active')) {
				input.type = 'text';
			} else {
				input.type = 'password';
			}
		});
	});
}
