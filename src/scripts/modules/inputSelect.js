import { Dropdown } from 'bootstrap';


/**
 * Получает список всех элементов с классом 'custom-select' на странице
 * @returns {NodeList} Список DOM-элементов с классом 'custom-select'
 * @throws {Error} Выбрасывает ошибку, если элементы не найдены
 */
function getSelectList () {
	const inputSelectList = document.querySelectorAll('.custom-select');
	if(!inputSelectList) throw new Error('.input-select not found');

	return inputSelectList;
}


class CustomSelect {
	constructor(baseSelectNode) {
		this.baseSelectNode = baseSelectNode;
		this.customSelect = this.baseSelectNode.dataset.target;
	}

	set baseSelectNode(node) {
		if(!node || !(node instanceof Element)) {
			throw new Error('Не удалось найти базовый элемент select или передан неверный тип данных')
		}
		this._baseSelectNode = node;
	}
	get baseSelectNode() {
		return this._baseSelectNode;
	}

	set customSelect(target) {
		if(!target) {
			throw new Error('custom target не может быть пустым')
		}
		
		if(target instanceof Element) {
			this._customSelect = target;
			return;
		}

		if(typeof target === 'string') {
			const node = document.querySelector(target);
			if(!node) {
				throw new Error(`Кастомный селект с id ${target} не найден в DOM`);
			}

			this._customSelect = node;
			return;
		}

		throw new Error('Неверный тип данных для custom target');
	}
	get customSelect() {
		return this._customSelect;
	}

	cloneOptions() {

	}

	initSyncSelects() {
		
	}
}


export default function() {
	const selectList = getSelectList();

	selectList.forEach(select => {
		
	})
}




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
