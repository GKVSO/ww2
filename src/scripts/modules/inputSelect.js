import { Dropdown } from 'bootstrap';

export default function () {
	const inputSelectList = document.querySelectorAll('.dropdown-input-select');
	if (!inputSelectList) {
		throw new Error('input select list not found');
	}

	inputSelectList.forEach((inputSelect) => {
		const hiddenInput = inputSelect.querySelector(
			'.dropdown-input-select__input-hidden'
		);
		if (!hiddenInput) {
			throw new Error('input hidden into dropdown not found');
		}

		const spanValue = inputSelect.querySelector(
			'.dropdown-input-select__value'
		);
		if (!spanValue) {
			throw new Error('span value into dropdown not found');
		}

		const inputSelectDropdown = new Dropdown(inputSelect);

		inputSelect.addEventListener('click', function (event) {
			event.preventDefault();
			const eventInput = new Event('input', {
				bubbles: true,
				cancelable: true,
			});

			if (!event.target.classList.contains('dropdown-item')) return false;

			const selectValue = event.target.dataset.value;
			const selectText = event.target.innerText;

			hiddenInput.value = selectValue;
			hiddenInput.dispatchEvent(eventInput);
			spanValue.innerText = selectText;
		});
	});
}
