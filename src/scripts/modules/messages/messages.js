import { Collapse, Modal } from 'bootstrap';

/**
 * Конфигурация приложения
 * @type {Object}
 */
const CONFIG = {
	selectors: {
		messageForm: '.message-form',
		quoteForm: '#formModalQuote',
		quoteModal: '#modal-quote',
		replyBlock: '#collapseReply',
		replyButton: '.message-item .btn-message-reply',
		clearReply: '#clearReply',
		reportModal: '.modal-report',
		messageItem: '.message-item',
		messageText: '.message-item__message',
		userAvatar: '.user-block__avatar',
		userName: '.user-block__name',
	},
	defaults: {
		anonymousName: 'Аноним',
		defaultAvatar: `<svg width="24" height="26" viewBox="0 0 24 26" fill="white" xmlns="http://www.w3.org/2000/svg">
			<path d="M16.8 14.625C15.2625 14.625 14.5232 15.4375 12 15.4375C9.47679 15.4375 8.74286 14.625 7.2 14.625C3.225 14.625 0 17.682 0 21.45V23.5625C0 24.9082 1.15179 26 2.57143 26H21.4286C22.8482 26 24 24.9082 24 23.5625V21.45C24 17.682 20.775 14.625 16.8 14.625ZM22.2857 23.5625C22.2857 24.0094 21.9 24.375 21.4286 24.375H2.57143C2.1 24.375 1.71429 24.0094 1.71429 23.5625V21.45C1.71429 18.5809 4.17321 16.25 7.2 16.25C8.25 16.25 9.29464 17.0625 12 17.0625C14.7 17.0625 15.75 16.25 16.8 16.25C19.8268 16.25 22.2857 18.5809 22.2857 21.45V23.5625ZM12 13C15.7875 13 18.8571 10.0902 18.8571 6.5C18.8571 2.90977 15.7875 0 12 0C8.2125 0 5.14286 2.90977 5.14286 6.5C5.14286 10.0902 8.2125 13 12 13ZM12 1.625C14.8339 1.625 17.1429 3.81367 17.1429 6.5C17.1429 9.18633 14.8339 11.375 12 11.375C9.16607 11.375 6.85714 9.18633 6.85714 6.5C6.85714 3.81367 9.16607 1.625 12 1.625Z"></path>
		</svg>`,
	},
	attributes: {
		messageId: 'data-message-id',
		userId: 'data-user-id',
		userName: 'data-user-name',
	},
};

/**
 * Класс для обработки ошибок в приложении
 * @extends Error
 */
class MessageError extends Error {
	/**
	 * @param {string} message - Сообщение об ошибке
	 * @param {string} code - Код ошибки
	 */
	constructor(message, code) {
		super(message);
		this.name = 'MessageError';
		this.code = code;
	}
}

/**
 * Вспомогательный класс для работы с DOM
 */
class DOMHelper {
	/**
	 * Получает элемент по селектору
	 * @param {string} selector - CSS селектор
	 * @param {Document|Element} [context=document] - Контекст поиска
	 * @returns {Element} Найденный элемент
	 * @throws {MessageError} Если элемент не найден
	 */
	static getElement(selector, context = document) {
		const element = context.querySelector(selector);
		if (!element) {
			throw new MessageError(
				`Element not found: ${selector}`,
				'ELEMENT_NOT_FOUND'
			);
		}
		return element;
	}

	/**
	 * Получает все элементы по селектору
	 * @param {string} selector - CSS селектор
	 * @param {Document|Element} [context=document] - Контекст поиска
	 * @returns {NodeList} Найденные элементы
	 * @throws {MessageError} Если элементы не найдены
	 */
	static getElements(selector, context = document) {
		const elements = context.querySelectorAll(selector);
		if (!elements.length) {
			throw new MessageError(
				`Elements not found: ${selector}`,
				'ELEMENTS_NOT_FOUND'
			);
		}
		return elements;
	}

	/**
	 * Получает значение атрибута элемента
	 * @param {Element} element - DOM элемент
	 * @param {string} attribute - Имя атрибута
	 * @returns {string} Значение атрибута
	 * @throws {MessageError} Если атрибут не найден
	 */
	static getAttribute(element, attribute) {
		const value = element.getAttribute(attribute);
		if (!value) {
			throw new MessageError(
				`Attribute not found: ${attribute}`,
				'ATTRIBUTE_NOT_FOUND'
			);
		}
		return value;
	}

	/**
	 * Санитизирует HTML строку
	 * @param {string} str - Исходная строка
	 * @returns {string} Санитизированная строка
	 */
	static sanitizeHTML(str) {
		const div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}
}

/**
 * Базовый класс для работы с событиями
 */
class EventEmitter {
	/**
	 * Создает новый экземпляр EventEmitter
	 */
	constructor() {
		this.events = new Map();
	}

	/**
	 * Подписывается на событие
	 * @param {string} event - Имя события
	 * @param {Function} callback - Функция-обработчик
	 */
	on(event, callback) {
		if (!this.events.has(event)) {
			this.events.set(event, new Set());
		}
		this.events.get(event).add(callback);
	}

	/**
	 * Отписывается от события
	 * @param {string} event - Имя события
	 * @param {Function} callback - Функция-обработчик
	 */
	off(event, callback) {
		if (this.events.has(event)) {
			this.events.get(event).delete(callback);
		}
	}

	/**
	 * Генерирует событие
	 * @param {string} event - Имя события
	 * @param {*} data - Данные события
	 */
	emit(event, data) {
		if (this.events.has(event)) {
			this.events.get(event).forEach((callback) => callback(data));
		}
	}
}

/**
 * Менеджер скрытых полей форм
 * @extends EventEmitter
 */
class HiddenInputsManager extends EventEmitter {
	/**
	 * Создает новый экземпляр HiddenInputsManager
	 */
	constructor() {
		super();
		this.mapCreatedInputs = new WeakMap();
	}

	/**
	 * Устанавливает значения скрытых полей
	 * @param {HTMLFormElement} form - Форма
	 * @param {Object} objectData - Данные для установки
	 * @throws {MessageError} Если форма или данные отсутствуют
	 */
	setInput(form, objectData) {
		if (!form || !objectData) {
			throw new MessageError('Form or data is missing', 'INVALID_INPUT');
		}

		if (!this.mapCreatedInputs.has(form)) {
			this.mapCreatedInputs.set(form, []);
		}

		const inputList = this.mapCreatedInputs.get(form);

		for (const [key, value] of Object.entries(objectData)) {
			const sanitizedValue = DOMHelper.sanitizeHTML(String(value));
			const inputDuplicate = inputList.find((input) => input.id === key);

			if (inputDuplicate) {
				inputDuplicate.value = sanitizedValue;
				continue;
			}

			const nodeInput = this.createHiddenInput(key, sanitizedValue);
			form.prepend(nodeInput);
			inputList.push(nodeInput);
		}

		this.mapCreatedInputs.set(form, inputList);
		this.emit('inputsUpdated', { form, data: objectData });
	}

	/**
	 * Очищает скрытые поля формы
	 * @param {HTMLFormElement} form - Форма
	 */
	clearInput(form) {
		if (!form) return;

		const inputList = this.mapCreatedInputs.get(form);
		if (!inputList) return;

		inputList.forEach((input) => input.remove());
		this.mapCreatedInputs.delete(form);
		this.emit('inputsCleared', { form });
	}

	/**
	 * Создает скрытое поле
	 * @param {string} id - Идентификатор поля
	 * @param {string} value - Значение поля
	 * @returns {HTMLInputElement} Созданное поле
	 */
	createHiddenInput(id, value) {
		const nodeInput = document.createElement('input');
		nodeInput.type = 'hidden';
		nodeInput.id = id;
		nodeInput.name = id;
		nodeInput.value = value;
		return nodeInput;
	}
}

/**
 * Базовый класс для обработчиков сообщений
 * @extends EventEmitter
 */
class MessageHandler extends EventEmitter {
	/**
	 * Создает новый экземпляр MessageHandler
	 * @param {HiddenInputsManager} hiddenInputsManager - Менеджер скрытых полей
	 */
	constructor(hiddenInputsManager) {
		super();
		this.hiddenInputsManager = hiddenInputsManager;
		this.messageForm = DOMHelper.getElement(CONFIG.selectors.messageForm);
	}

	/**
	 * Получает данные сообщения из контейнера
	 * @param {Element} messageContainer - Контейнер сообщения
	 * @returns {Object} Данные сообщения
	 */
	getMessageData(messageContainer) {
		return {
			messageId: DOMHelper.getAttribute(
				messageContainer,
				CONFIG.attributes.messageId
			),
			userId: DOMHelper.getAttribute(
				messageContainer,
				CONFIG.attributes.userId
			),
			userName:
				messageContainer.getAttribute(CONFIG.attributes.userName) ||
				CONFIG.defaults.anonymousName,
			avatar:
				messageContainer.querySelector(
					`${CONFIG.selectors.userAvatar} picture`
				) || null,
		};
	}

	/**
	 * Прокручивает страницу к форме
	 */
	scrollToForm() {
		this.messageForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
}

/**
 * Обработчик ответов на сообщения
 * @extends MessageHandler
 */
class ReplyHandler extends MessageHandler {
	/**
	 * Создает новый экземпляр ReplyHandler
	 * @param {HiddenInputsManager} hiddenInputsManager - Менеджер скрытых полей
	 */
	constructor(hiddenInputsManager) {
		super(hiddenInputsManager);
		this.init();
	}

	/**
	 * Инициализирует обработчик
	 */
	init() {
		this.replyBlock = DOMHelper.getElement(CONFIG.selectors.replyBlock);
		this.replyBlockCollapse = new Collapse(this.replyBlock, { toggle: false });

		this.initReplyButtons();
		this.initClearButton();
	}

	/**
	 * Инициализирует кнопки ответа
	 */
	initReplyButtons() {
		const replyButtons = DOMHelper.getElements(CONFIG.selectors.replyButton);
		replyButtons.forEach((button) => {
			button.addEventListener('click', this.handleReplyButtonClick.bind(this));
		});
	}

	/**
	 * Обрабатывает клик по кнопке ответа
	 * @param {Event} event - Событие клика
	 */
	handleReplyButtonClick(event) {
		const messageContainer = event.target.closest(CONFIG.selectors.messageItem);
		if (!messageContainer) {
			throw new MessageError(
				'Message container not found',
				'CONTAINER_NOT_FOUND'
			);
		}

		const messageData = this.getMessageData(messageContainer);
		this.hiddenInputsManager.setInput(this.messageForm, {
			replyMessageId: messageData.messageId,
			replyUserId: messageData.userId,
			replyUserName: messageData.userName,
		});

		this.updateUserInfo(messageData);
		this.scrollToForm();
		this.replyBlockCollapse.show();

		this.emit('replyStarted', messageData);
	}

	/**
	 * Обновляет информацию о пользователе
	 * @param {Object} messageData - Данные сообщения
	 */
	updateUserInfo(messageData) {
		const nodeUserName = DOMHelper.getElement(
			CONFIG.selectors.userName,
			this.messageForm
		);
		nodeUserName.textContent = messageData.userName;

		const nodeAvatar = DOMHelper.getElement(
			CONFIG.selectors.userAvatar,
			this.messageForm
		);
		nodeAvatar.innerHTML = '';

		const avatar = messageData.avatar
			? messageData.avatar.cloneNode(true)
			: this.createDefaultAvatar();

		nodeAvatar.appendChild(avatar);
	}

	/**
	 * Создает аватар по умолчанию
	 * @returns {Element} SVG элемент аватара
	 */
	createDefaultAvatar() {
		const svg = document.createElement('div');
		svg.innerHTML = CONFIG.defaults.defaultAvatar;
		return svg.firstChild;
	}

	/**
	 * Инициализирует кнопку очистки ответа
	 */
	initClearButton() {
		const clearButton = DOMHelper.getElement(CONFIG.selectors.clearReply);
		clearButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.replyBlockCollapse.hide();
			this.hiddenInputsManager.clearInput(this.messageForm);
			this.emit('replyCleared');
		});
	}
}

/**
 * Обработчик цитирования сообщений
 * @extends ReplyHandler
 */
class QuoteHandler extends ReplyHandler {
	/**
	 * Создает новый экземпляр QuoteHandler
	 * @param {HiddenInputsManager} hiddenInputsManager - Менеджер скрытых полей
	 */
	constructor(hiddenInputsManager) {
		super(hiddenInputsManager);
		this.init();
	}

	/**
	 * Инициализирует обработчик
	 */
	init() {
		// Инициализируем блок ответа
		this.replyBlock = DOMHelper.getElement(CONFIG.selectors.replyBlock);
		this.replyBlockCollapse = new Collapse(this.replyBlock, { toggle: false });

		this.initQuoteForms();
		this.initQuoteModals();
		this.initClearButton();
		this.initEditQuoteButton();
	}

	/**
	 * Инициализирует формы цитирования
	 */
	initQuoteForms() {
		const formQuotes = DOMHelper.getElements(CONFIG.selectors.quoteForm);
		formQuotes.forEach((form) => {
			form.addEventListener('submit', this.handleQuoteSubmit.bind(this));
		});
	}

	/**
	 * Обрабатывает отправку формы цитирования
	 * @param {Event} event - Событие отправки формы
	 */
	handleQuoteSubmit(event) {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);
		const quoteMessage = formData.get('quoteMessage');

		if (!quoteMessage?.trim()) {
			this.emit(
				'error',
				new MessageError('Empty quote message', 'EMPTY_QUOTE')
			);
			return;
		}

		const nodeCurrentModal = form.closest('.modal');
		const currentModal = Modal.getInstance(nodeCurrentModal);

		if (!currentModal) {
			throw new MessageError('Modal instance not found', 'MODAL_NOT_FOUND');
		}

		this.updateQuoteBlock(quoteMessage);
		currentModal.hide();

		// Показываем блок ответа после подтверждения цитаты
		if (this.replyBlockCollapse) {
			this.replyBlockCollapse.show();
		}

		setTimeout(() => {
			this.scrollToForm();
		}, 300);
	}

	/**
	 * Обновляет блок цитирования
	 * @param {string} quoteMessage - Текст цитаты
	 */
	updateQuoteBlock(quoteMessage) {
		const quoteBlock = DOMHelper.getElement('#collapseQuote', this.messageForm);
		const quoteBlockText = DOMHelper.getElement(
			'.form-quote__text',
			quoteBlock
		);
		const quoteBlockCollapse = new Collapse(quoteBlock, { toggle: false });

		quoteBlockText.textContent = DOMHelper.sanitizeHTML(quoteMessage);
		quoteBlockCollapse.show();
		this.emit('quoteUpdated', { message: quoteMessage });
	}

	/**
	 * Инициализирует модальные окна цитирования
	 */
	initQuoteModals() {
		const quoteModals = DOMHelper.getElements(CONFIG.selectors.quoteModal);
		quoteModals.forEach((modal) => {
			const form = DOMHelper.getElement('form', modal);
			const messageInput = DOMHelper.getElement('#quoteMessage', form);

			modal.addEventListener(
				'show.bs.modal',
				this.handleQuoteModalShow.bind(this, modal, messageInput)
			);
			modal.addEventListener('hide.bs.modal', () => {
				messageInput.value = '';
			});
		});
	}

	/**
	 * Обрабатывает открытие модального окна цитирования
	 * @param {Element} modal - Модальное окно
	 * @param {HTMLInputElement} messageInput - Поле ввода сообщения
	 * @param {Event} event - Событие открытия окна
	 */
	handleQuoteModalShow(modal, messageInput, event) {
		const relatedTarget = event.relatedTarget;
		if (!relatedTarget.classList.contains('btn-message-quote')) return;

		const messageContainer = relatedTarget.closest(
			CONFIG.selectors.messageItem
		);
		if (!messageContainer) {
			throw new MessageError(
				'Message container not found',
				'CONTAINER_NOT_FOUND'
			);
		}

		const messageText = DOMHelper.getElement(
			CONFIG.selectors.messageText,
			messageContainer
		);
		const quoteText = messageText.innerText;

		if (!quoteText) {
			throw new MessageError('Quote text not found', 'QUOTE_TEXT_NOT_FOUND');
		}

		// Получаем данные сообщения для ответа
		const messageData = this.getMessageData(messageContainer);

		// Добавляем скрытые поля для ответа (наследуется от ReplyHandler)
		this.hiddenInputsManager.setInput(this.messageForm, {
			replyMessageId: messageData.messageId,
			replyUserId: messageData.userId,
			replyUserName: messageData.userName,
			// Добавляем поле с текстом цитаты
			quoteText: quoteText,
		});

		// Обновляем информацию о пользователе (наследуется от ReplyHandler)
		this.updateUserInfo(messageData);

		messageInput.value = quoteText;
		messageInput.dispatchEvent(new Event('input', { bubbles: true }));

		const { userId } = messageData;
		if (!userId) {
			throw new MessageError('User ID not found', 'USER_ID_NOT_FOUND');
		}
	}

	/**
	 * Инициализирует кнопку очистки
	 */
	initClearButton() {
		const clearButton = DOMHelper.getElement(CONFIG.selectors.clearReply);
		clearButton.addEventListener('click', (event) => {
			event.preventDefault();

			// Скрываем блок ответа
			this.replyBlockCollapse.hide();

			// Скрываем блок цитаты
			const quoteBlock = DOMHelper.getElement(
				'#collapseQuote',
				this.messageForm
			);
			const quoteBlockCollapse = new Collapse(quoteBlock, { toggle: false });
			quoteBlockCollapse.hide();

			// Очищаем скрытые поля
			this.hiddenInputsManager.clearInput(this.messageForm);

			this.emit('replyCleared');
		});
	}

	/**
	 * Инициализирует кнопку редактирования цитаты
	 */
	initEditQuoteButton() {
		const editButton = DOMHelper.getElement('#edit-quote');
		editButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.handleEditQuote();
		});
	}

	/**
	 * Обрабатывает нажатие на кнопку редактирования цитаты
	 */
	handleEditQuote() {
		// Получаем модальное окно
		const modalQuote = DOMHelper.getElement(CONFIG.selectors.quoteModal);
		const modal = Modal.getInstance(modalQuote) || new Modal(modalQuote);

		// Получаем форму и поле ввода в модальном окне
		const form = DOMHelper.getElement('form', modalQuote);
		const messageInput = DOMHelper.getElement('#quoteMessage', form);

		// Получаем текст цитаты из скрытого поля
		const quoteText =
			this.messageForm.querySelector('input[name="quoteText"]')?.value || '';

		// Устанавливаем текст в поле ввода
		messageInput.value = quoteText;
		messageInput.dispatchEvent(new Event('input', { bubbles: true }));

		// Открываем модальное окно
		modal.show();
	}
}

/**
 * Обработчик жалоб на сообщения
 * @extends MessageHandler
 */
class ReportHandler extends MessageHandler {
	/**
	 * Создает новый экземпляр ReportHandler
	 * @param {HiddenInputsManager} hiddenInputsManager - Менеджер скрытых полей
	 */
	constructor(hiddenInputsManager) {
		super(hiddenInputsManager);
		this.init();
	}

	/**
	 * Инициализирует обработчик
	 */
	init() {
		const modalReports = DOMHelper.getElements(CONFIG.selectors.reportModal);
		modalReports.forEach((modal) => {
			modal.addEventListener(
				'show.bs.modal',
				this.handleModalShow.bind(this, modal)
			);
			modal.addEventListener(
				'hide.bs.modal',
				this.handleModalHide.bind(this, modal)
			);
		});
	}

	/**
	 * Обрабатывает открытие модального окна жалобы
	 * @param {Element} modal - Модальное окно
	 * @param {Event} event - Событие открытия окна
	 */
	handleModalShow(modal, event) {
		const messageContainer = event.relatedTarget.closest(
			CONFIG.selectors.messageItem
		);
		const modalForm = DOMHelper.getElement('form', modal);

		if (!messageContainer) {
			throw new MessageError(
				'Message container not found',
				'CONTAINER_NOT_FOUND'
			);
		}

		const { messageId, userId } = this.getMessageData(messageContainer);
		this.hiddenInputsManager.setInput(modalForm, { messageId, userId });

		this.emit('reportStarted', { messageId, userId });
	}

	/**
	 * Обрабатывает закрытие модального окна жалобы
	 * @param {Element} modal - Модальное окно
	 */
	handleModalHide(modal) {
		const modalForm = DOMHelper.getElement('form', modal);
		this.hiddenInputsManager.clearInput(modalForm);
		this.emit('reportCancelled');
	}
}

/**
 * Фабрика для создания обработчиков сообщений
 */
class MessageHandlersFactory {
	/**
	 * Создает набор обработчиков сообщений
	 * @returns {Object} Объект с обработчиками
	 */
	static create() {
		const hiddenInputsManager = new HiddenInputsManager();
		return {
			report: new ReportHandler(hiddenInputsManager),
			reply: new ReplyHandler(hiddenInputsManager),
			quote: new QuoteHandler(hiddenInputsManager),
		};
	}
}

/**
 * Инициализирует обработчики сообщений
 */
export default function () {
	const handlers = MessageHandlersFactory.create();

	// Добавляем глобальные обработчики ошибок
	Object.values(handlers).forEach((handler) => {
		handler.on('error', (error) => {
			console.error(`Message handler error: ${error.message}`, error);
			// Здесь можно добавить отправку ошибок в систему мониторинга
		});
	});
}
