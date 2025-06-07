import { Dropdown } from 'bootstrap';

/**
 * Получает список всех элементов с классом 'custom-select' на странице
 * @returns {NodeList} Список DOM-элементов с классом 'custom-select'
 * @throws {Error} Выбрасывает ошибку, если элементы не найдены
 */
function getSelectList() {
	const inputSelectList = document.querySelectorAll('.custom-select');
	if (!inputSelectList) throw new Error('.input-select not found');

	return inputSelectList;
}

class CustomSelect {
	eventOptionInput = new Event('input', {
		bubbles: true,
		cancelable: true,
	});
	eventOptionChange = new Event('change', {
		bubbles: true,
		cancelable: true,
	});

	constructor(baseSelectNode) {
		this.baseSelectNode = baseSelectNode;
		this.customSelectNode = this.baseSelectNode.dataset.target;

		// TODO: Можно устанавливать по сути в сеттере customSelectNode, так как он зависит от него. Подумать об этом. Или наоборот им тоже написать геттеры и сеттеры для обработчки ошибок.в
		this.dropdownMenuNode =
			this.customSelectNode.querySelector('.dropdown-menu');
		this.customSelectSpan = this.customSelectNode.querySelector(
			'.dropdown-input-select__value'
		);
		this.dropdownToggle =
			this.customSelectNode.querySelector('.dropdown-toggle');

		this.init();
	}

	// TODO: по сути можно убрать геттер и защищенные свойства
	set baseSelectNode(node) {
		if (!node || !(node instanceof Element)) {
			throw new Error(
				'Не удалось найти базовый элемент select или передан неверный тип данных'
			);
		}
		this._baseSelectNode = node;
	}
	get baseSelectNode() {
		if (!this._baseSelectNode) {
			throw new Error('baseSelectNode undefined');
		}

		return this._baseSelectNode;
	}

	set customSelectNode(target) {
		if (!target) {
			throw new Error('custom target не может быть пустым');
		}

		if (target instanceof Element) {
			this._customSelectNode = target;
			return;
		}

		if (typeof target === 'string') {
			const node = document.querySelector(target);
			if (!node) {
				throw new Error(`Кастомный селект с id ${target} не найден в DOM`);
			}

			this._customSelectNode = node;
			return;
		}

		throw new Error('Неверный тип данных для custom target');
	}
	get customSelectNode() {
		if (!this._customSelectNode) {
			throw new Error('customSelectNode undefined');
		}

		return this._customSelectNode;
	}

	init() {
		// Скрываем настоящий select
		this.baseSelectNode.style.display = 'none';

		// Копируем опции в кастомный селект
		this.cloneOptions();

		// Подписываемся на изменения у базового <select> (добавление/удаление/правка option)
		this.mutationObserve();

		// Если внешний код (Vue, сервер, другой скрипт) изменит selected/value, обновляем текст
		this.baseSelectNode.addEventListener('change', () => {
			this.updateSelectedText();
		});

		// Добавляем обработчик клавиш для раскрытия меню
		this.dropdownToggle.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				const dropdown = Dropdown.getOrCreateInstance(this.dropdownToggle);
				dropdown.toggle();
			}
		});

		// Сразу установить текст, если в <select> была опция с selected при загрузке
		this.updateSelectedText();
	}

	cloneOptions() {
		// Чистим старое содержимое кастом-списка
		this.dropdownMenuNode.innerHTML = '';

		// TODO: По сути можно добавлять опции в сеттере baseSelectNode
		this.options = this.baseSelectNode.options;

		[...this.options].forEach((option) => {
			this.renderOption(option);
		});
	}

	mutationObserve() {
		const mo = new MutationObserver((mutationList) => {
			let needRerender;

			for (const mutation of mutationList) {
				if (
					mutation.type === 'childList' ||
					mutation.type === 'attributes' ||
					mutation.type === 'characterData'
				) {
					needRerender = true;
					break;
				}
			}

			if (needRerender) {
				this.cloneOptions();
				this.updateSelectedText();
			}
		});

		mo.observe(this.baseSelectNode, {
			childList: true, // добавление/удаление <option>
			attributes: true, // изменение атрибутов (value, selected и т.д.)
			subtree: true, // искать изменения во вложенных узлах (чтобы поймать characterData внутри <option>)
			characterData: true, // изменение текcта внутри <option>
		});
	}

	renderOption(option) {
		// Выходим если value пустой
		if (!option.value) return;

		// Создаем новые узлы
		const li = document.createElement('li');
		const newOptionBtn = document.createElement('button');

		// Работаем с кнопкой
		newOptionBtn.classList.add('dropdown-item');
		newOptionBtn.dataset.value = option.value;
		newOptionBtn.innerText = option.text;
		newOptionBtn.setAttribute('type', 'button');
		newOptionBtn.setAttribute('role', 'option');
		newOptionBtn.setAttribute(
			'aria-selected',
			option.selected ? 'true' : 'false'
		);

		newOptionBtn.addEventListener('click', (event) => {
			this.onOptionSelect(event);
		});

		// Добавляем в документ новый option
		li.appendChild(newOptionBtn);
		this.dropdownMenuNode.appendChild(li);

		if (option.selected) {
			// TODO: Установка текста выбранного значения можно вынести в отдельный метод, т.к используется несколько раз
			this.customSelectSpan.innerText = option.text;
		}
	}

	/**
	 * Вспомогательный метод: смотрим, какая сейчас активна <option>,
	 * и ставим её текст в кастомный спан.
	 */
	updateSelectedText() {
		const selectedOption = this.baseSelectNode.selectedOptions[0];
		if (selectedOption || selectedOption.text.lenght !== 0) {
			this.customSelectSpan.innerText = selectedOption.text;

			this.baseSelectNode.dispatchEvent(this.eventOptionInput);
		} else {
			// Если ничего не выбрано, можно поставить плейсхолдер или пустую строку
			this.customSelectSpan.innerText = '';
		}
	}

	onOptionSelect(event) {
		event.preventDefault();
		if (!event.target.classList.contains('dropdown-item')) return false;

		// Сбрасываем aria-selected для всех кнопок
		this.dropdownMenuNode.querySelectorAll('[role="option"]').forEach((btn) => {
			btn.setAttribute('aria-selected', 'false');
		});

		// Устанавливаем aria-selected для выбранной кнопки
		event.target.setAttribute('aria-selected', 'true');

		const selectedValue = event.target.dataset.value;
		const selectedText = event.target.innerText;

		this.baseSelectNode.value = selectedValue;
		this.customSelectSpan.innerText = selectedText;

		this.baseSelectNode.dispatchEvent(this.eventOptionInput);
		this.baseSelectNode.dispatchEvent(this.eventOptionChange);
	}
}

export default function () {
	const selectList = getSelectList();

	selectList.forEach((select) => {
		const customSelect = new CustomSelect(select);
	});
}

// export default function () {
// 	const inputSelectList = document.querySelectorAll('.dropdown-input-select');
// 	if (!inputSelectList) {
// 		throw new Error('input select list not found');
// 	}

// 	inputSelectList.forEach((inputSelect) => {
// 		const hiddenInput = inputSelect.querySelector(
// 			'.dropdown-input-select__input-hidden'
// 		);
// 		if (!hiddenInput) {
// 			throw new Error('input hidden into dropdown not found');
// 		}

// 		const spanValue = inputSelect.querySelector(
// 			'.dropdown-input-select__value'
// 		);
// 		if (!spanValue) {
// 			throw new Error('span value into dropdown not found');
// 		}

// 		const inputSelectDropdown = new Dropdown(inputSelect);

// 		inputSelect.addEventListener('click', function (event) {
// 			event.preventDefault();

// 			if (!event.target.classList.contains('dropdown-item')) return false;

// 			const selectValue = event.target.dataset.value;
// 			const selectText = event.target.innerText;

// 			hiddenInput.value = selectValue;
// 			hiddenInput.dispatchEvent(this.eve);
// 			spanValue.innerText = selectText;
// 		});
// 	});
// }
