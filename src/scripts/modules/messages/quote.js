/**
 * Класс для управления функциональностью цитирования сообщений
 */
export class QuoteManager {
	/**
	 * Создает новый экземпляр QuoteManager
	 * @param {Object} options - Опции конфигурации
	 * @param {string} options.messageSelector - Селектор для сообщений
	 * @param {string} options.quoteButtonClass - Класс кнопки цитирования
	 * @param {string} options.quoteButtonId - ID кнопки цитирования
	 * @param {Function} options.onQuoteClick - Колбэк-функция, вызываемая при нажатии на кнопку цитирования
	 */
	constructor(options = {}) {
		this.options = {
			messageSelector: '.message-item__message',
			quoteButtonClass: 'quote-btn',
			quoteButtonId: 'quoteFloatBtn',
			onQuoteClick: null,
			...options,
		};

		this.isSelection = false;
		this.quoteButton = null;
		this.targetBlocks = document.querySelectorAll(this.options.messageSelector);

		/**
		 * SVG иконка для кнопки цитирования
		 * @type {string}
		 */
		this.quoteIcon = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 448 512"
				fill="currentColor"
				width="20px"
				height="20px"
			>
				<path
					d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z"
				/>
			</svg>
			Цитировать
		`;

		this.init();
	}

	/**
	 * Инициализирует обработчики событий
	 */
	init() {
		// Обработчики для скрытия кнопки цитирования
		document.addEventListener('scroll', this.hideQuoteButton.bind(this));
		document.addEventListener('mousedown', this.hideQuoteButton.bind(this));

		// Обработчик изменения выделения
		document.addEventListener(
			'selectionchange',
			this.handleSelectionChange.bind(this)
		);

		// Обработчики для блоков сообщений
		this.targetBlocks.forEach((target) => {
			target.addEventListener('mouseup', this.handleSelection.bind(this));
			target.addEventListener('touchend', this.handleSelection.bind(this));
		});
	}

	/**
	 * Обрабатывает изменение выделения текста
	 */
	handleSelectionChange() {
		const selection = this.getSelection();

		// Проверяем, тройной ли это был щелчек
		if (this.isTripleClick(selection)) {
			selection.extend(selection.anchorNode, selection.anchorNode.length);
		}

		if (selection.rangeCount === 0) {
			this.isSelection = false;
			this.hideQuoteButton();
			return false;
		}

		let startNode = selection.anchorNode;
		if (startNode.nodeName === '#text') {
			startNode = startNode.parentNode;
		}
		startNode = startNode.closest(this.options.messageSelector);

		let endNode = selection.focusNode;
		if (endNode.nodeName === '#text') {
			endNode = endNode.parentNode;
		}
		endNode = endNode.closest(this.options.messageSelector);

		if (startNode !== endNode) {
			this.isSelection = false;
			this.hideQuoteButton();
			return false;
		}

		if (selection.isCollapsed) {
			this.isSelection = false;
			this.hideQuoteButton();
			return false;
		}

		if (startNode) {
			this.isSelection = true;
		}
	}

	/**
	 * Скрывает кнопку цитирования
	 * @param {Event} event - Событие, вызвавшее скрытие кнопки
	 */
	hideQuoteButton(event) {
		const quoteBtn = document.querySelector(
			`.${this.options.quoteButtonClass}`
		);

		if (event && event.target === quoteBtn) return false;

		if (quoteBtn) {
			quoteBtn.classList.remove('active');
		}
	}

	/**
	 * Обрабатывает выделение текста и показывает кнопку цитирования
	 */
	handleSelection() {
		if (!this.isSelection) return false;

		const selection = window.getSelection();

		const targetRange = document.createRange();
		targetRange.setStart(selection.focusNode, selection.focusOffset);
		targetRange.setEnd(selection.focusNode, selection.focusOffset);

		let rect = targetRange.getBoundingClientRect();

		if (rect.top === 0 && rect.left === 0) {
			const tmpNode = document.createTextNode('\ufeff');
			targetRange.setStart(selection.anchorNode, selection.anchorNode.length);
			targetRange.setEnd(selection.anchorNode, selection.anchorNode.length);
			targetRange.insertNode(tmpNode);
			rect = targetRange.getBoundingClientRect();
			tmpNode.remove();
		}

		const top = rect.top + window.scrollY;
		const left = rect.left + window.scrollX;

		this.showQuoteButton(top, left);
	}

	/**
	 * Показывает кнопку цитирования в указанной позиции
	 * @param {number} top - Позиция по вертикали
	 * @param {number} left - Позиция по горизонтали
	 */
	showQuoteButton(top, left) {
		let quoteBtn = document.querySelector(`.${this.options.quoteButtonClass}`);

		if (!quoteBtn) {
			quoteBtn = this.createQuoteButton();
		}

		quoteBtn.classList.add('active');
		quoteBtn.style.setProperty('--top', `${top}px`);
		quoteBtn.style.setProperty('--left', `${left}px`);
	}

	/**
	 * Создает кнопку цитирования
	 * @returns {HTMLElement} Созданная кнопка
	 */
	createQuoteButton() {
		const quoteBtn = document.createElement('button');
		quoteBtn.classList.add(this.options.quoteButtonClass, 'btn', 'active');
		quoteBtn.id = this.options.quoteButtonId;

		// Используем свойство класса для иконки
		quoteBtn.innerHTML = this.quoteIcon;

		// Добавляем обработчик события нажатия на кнопку
		quoteBtn.addEventListener('click', this.handleQuoteButtonClick.bind(this));

		document.body.appendChild(quoteBtn);
		return quoteBtn;
	}

	/**
	 * Обрабатывает нажатие на кнопку цитирования
	 * @param {Event} event - Событие нажатия
	 */
	handleQuoteButtonClick(event) {
		event.preventDefault();

		// Если передан колбэк, вызываем его
		if (typeof this.options.onQuoteClick === 'function') {
			const selection = this.getSelection();
			this.options.onQuoteClick(selection, event);
		}

		// Скрываем кнопку после нажатия
		this.hideQuoteButton();
	}

	/**
	 * Получает текущее выделение текста
	 * @returns {Selection} Объект выделения
	 */
	getSelection() {
		return window.getSelection();
	}

	/**
	 * Проверяет, является ли выделение результатом тройного щелчка
	 * @param {Selection} selection - Объект выделения
	 * @returns {boolean} true, если это тройной щелчок
	 */
	isTripleClick(selection) {
		return (
			selection.anchorNode !== selection.focusNode &&
			selection.anchorOffset === 1 &&
			selection.focusOffset === 0
		);
	}

	/**
	 * Уничтожает экземпляр и удаляет обработчики событий
	 */
	destroy() {
		document.removeEventListener('scroll', this.hideQuoteButton.bind(this));
		document.removeEventListener('mousedown', this.hideQuoteButton.bind(this));
		document.removeEventListener(
			'selectionchange',
			this.handleSelectionChange.bind(this)
		);

		this.targetBlocks.forEach((target) => {
			target.removeEventListener('mouseup', this.handleSelection.bind(this));
			target.removeEventListener('touchend', this.handleSelection.bind(this));
		});

		const quoteBtn = document.querySelector(
			`.${this.options.quoteButtonClass}`
		);
		if (quoteBtn) {
			// Удаляем обработчик события нажатия
			quoteBtn.removeEventListener(
				'click',
				this.handleQuoteButtonClick.bind(this)
			);
			quoteBtn.remove();
		}
	}
}

/**
 * Создает и возвращает экземпляр QuoteManager
 * @param {Object} options - Опции конфигурации
 * @param {Function} options.onQuoteClick - Колбэк-функция, вызываемая при нажатии на кнопку цитирования
 * @returns {QuoteManager} Экземпляр QuoteManager
 */
export default function initQuoteManager() {
	// return new QuoteManager({
	// 	onQuoteClick: function (selection) {
	// 		console.log('test');
	// 	},
	// });
}
