export default function inputClear() {
	const forms = document.querySelectorAll('.search');

	forms.forEach((form) => {
		const btnClear = form.querySelector('.search__clear');
		const input = form.querySelector('input.search__input');

		btnClear.addEventListener('click', function (event) {
			event.preventDefault();
			input.value = '';
		});
	});
}
