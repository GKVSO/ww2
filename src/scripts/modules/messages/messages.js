import { Collapse, Modal } from 'bootstrap';

export default function () {
	reportHandler();
	replyHandler();
	quoteHandler();
}

function quoteHandler() {
	const sendMessageForm = document.querySelector('.message-form');
	const formQuote = document.querySelectorAll('#formModalQuote');

	formQuote.forEach((form) => {
		form.addEventListener('submit', function (event) {
			// Обрабатываем форму
			event.preventDefault();

			// Получаем значение формы
			const nodeCurrentModal = form.closest('.modal'),
				currentModal = Modal.getInstance(nodeCurrentModal);

			const formData = new FormData(form);
			const quoteMessage = formData.get('quoteMessage');

			if (quoteMessage <= 0) return false;

			// Передаем все форме отправке сообщения
			const quoteBlock = sendMessageForm.querySelector('#collapseQuote');
			const quoteBlockText = quoteBlock.querySelector('.form-quote__text');
			const quoteBlockCollapse = new Collapse(quoteBlock, {
				toggle: false,
			});

			currentModal.hide();
			sendMessageForm.scrollIntoView({
				sendMessageForm: 'smooth',
			});

			quoteBlockText.textContent = quoteMessage;
			quoteBlockCollapse.show();
		});
	});

	// Обработчик для открытия поп ап окна для цитаты
	const quoteModal = document.querySelectorAll('#modal-quote');
	quoteModal.forEach((modal) => {
		const form = modal.querySelector('form');
		if (!form) throw new Error('cannot found form in modal');

		const messageInput = form.querySelector('#quoteMessage');
		if (!messageInput) throw new Error('cannot found messageInput');

		modal.addEventListener('show.bs.modal', function (event) {
			const relatedTarget = event.relatedTarget;
			if (!relatedTarget.classList.contains('btn-message-quote')) return;

			const messageContainer = relatedTarget.closest('.message-item');
			if (!messageContainer) throw new Error('message container not found');

			const quoteText = messageContainer.querySelector(
				'.message-item__message'
			)?.innerText;
			if (!quoteText) throw new Error('cannot found quote text');

			messageInput.value = quoteText;
			messageInput.dispatchEvent(
				new Event('input', {
					bubbles: true,
				})
			);

			const replyUserId =
				messageContainer.getAttribute('data-user-id') || false;
			const replyUserName =
				messageContainer.getAttribute('data-user-name') || 'Аноним';
			const nodeImg =
				messageContainer.querySelector('.user-block__avatar picture') || false;

			// if (!replyMessageId || !replyUserId)
			// 	throw new Error('messageId or userId is not set');
		});
		modal.addEventListener('hide.bs.modal', function () {
			messageInput.value = '';
		});
	});
}

function replyHandler() {
	// Collapsing reply block in form
	const replyBlock = document.querySelector('#collapseReply') || false;
	if (!replyBlock) throw new Error('reply block into form not found');

	const replyBlockCollapse = new Collapse(replyBlock, {
		toggle: false,
	});

	const replyButtons = document.querySelectorAll(
		'.message-item .btn-message-reply'
	);
	if (!replyButtons.length) throw new Error('reply btns not found');

	const sendMessageForm = document.querySelector('.message-form');

	replyButtons.forEach((button) => {
		button.addEventListener('click', function (event) {
			const messageContainer = this.closest('.message-item');
			if (!messageContainer) throw new Error('message container not found');

			const replyMessageId =
				messageContainer.getAttribute('data-message-id') || false;
			const replyUserId =
				messageContainer.getAttribute('data-user-id') || false;
			const replyUserName =
				messageContainer.getAttribute('data-user-name') || 'Аноним';
			const nodeImg =
				messageContainer.querySelector('.user-block__avatar picture') || false;

			if (!replyMessageId || !replyUserId)
				throw new Error('messageId or userId is not set');

			hiddenInputs.setInput(sendMessageForm, {
				replyMessageId,
				replyUserId,
				replyUserName,
			});

			// Устанавливаем имя
			const nodeUserName = sendMessageForm.querySelector('.user-block__name');
			nodeUserName.textContent = replyUserName;

			// Устанавливаем картинку
			let replyNodeImg = null;
			if (nodeImg) {
				replyNodeImg = nodeImg.cloneNode(true);
			} else {
				replyNodeImg = document.createElement('svg');
				replyNodeImg.innerHTML = `<svg width="24" height="26" viewBox="0 0 24 26" fill="white" xmlns="http://www.w3.org/2000/svg">
					<path d="M16.8 14.625C15.2625 14.625 14.5232 15.4375 12 15.4375C9.47679 15.4375 8.74286 14.625 7.2 14.625C3.225 14.625 0 17.682 0 21.45V23.5625C0 24.9082 1.15179 26 2.57143 26H21.4286C22.8482 26 24 24.9082 24 23.5625V21.45C24 17.682 20.775 14.625 16.8 14.625ZM22.2857 23.5625C22.2857 24.0094 21.9 24.375 21.4286 24.375H2.57143C2.1 24.375 1.71429 24.0094 1.71429 23.5625V21.45C1.71429 18.5809 4.17321 16.25 7.2 16.25C8.25 16.25 9.29464 17.0625 12 17.0625C14.7 17.0625 15.75 16.25 16.8 16.25C19.8268 16.25 22.2857 18.5809 22.2857 21.45V23.5625ZM12 13C15.7875 13 18.8571 10.0902 18.8571 6.5C18.8571 2.90977 15.7875 0 12 0C8.2125 0 5.14286 2.90977 5.14286 6.5C5.14286 10.0902 8.2125 13 12 13ZM12 1.625C14.8339 1.625 17.1429 3.81367 17.1429 6.5C17.1429 9.18633 14.8339 11.375 12 11.375C9.16607 11.375 6.85714 9.18633 6.85714 6.5C6.85714 3.81367 9.16607 1.625 12 1.625Z"></path>
				</svg>`;
			}

			const nodeAvatar = sendMessageForm.querySelector('.user-block__avatar');
			if (!nodeAvatar) throw new Error('node avatar not found');

			nodeAvatar.innerHTML = '';
			nodeAvatar.appendChild(replyNodeImg);

			// Скроллим до формы отправки сообщения
			sendMessageForm.scrollIntoView({
				sendMessageForm: 'smooth',
			});

			replyBlockCollapse.show();
		});
	});

	const nodeClearReply = document.querySelector('#clearReply');
	nodeClearReply.addEventListener('click', function (event) {
		event.preventDefault();
		replyBlockCollapse.hide();
		hiddenInputs.clearInput(sendMessageForm);
	});
}

/**
 * Функция modalReport инициализирует обработчики событий для модальных окон "пожаловаться".
 * Она управляет установкой и сбросом значений скрытых полей формы в модальных окнах при их открытии и закрытии.
 */
function reportHandler() {
	// Получаем все элементы модальных окон с классом 'modal-report'
	const modalReports = document.querySelectorAll('.modal-report');

	// Если модальные окна не найдены, функция возвращает false
	if (!modalReports) return false;

	// Для каждого найденного модального окна устанавливаем обработчики событий
	modalReports.forEach((modal) => {
		// Обработчик события открытия модального окна
		modal.addEventListener('show.bs.modal', function (event) {
			// Находим контейнер сообщения, связанный с модальным окном
			const messageContainer = event.relatedTarget.closest('.message-item');

			const modalForm = this.querySelector('form') || false;
			if (!modalForm) throw new Error('not found form into report modal');

			// Если контейнер сообщения не найден, выбрасываем ошибку
			if (!messageContainer) throw new Error('message container not found');

			// Получаем идентификаторы сообщения и пользователя из атрибутов контейнера
			const messageId =
				messageContainer.getAttribute('data-message-id') || false;
			const userId = messageContainer.getAttribute('data-user-id') || false;

			// Если идентификаторы не установлены, выбрасываем ошибку
			if (!messageId || !userId)
				throw new Error('messageId or userId is not set');

			// Устанавливаем значения скрытых полей формы в модальном окне
			hiddenInputs.setInput(modalForm, {
				messageId,
				userId,
			});
		});

		// Обработчик события закрытия модального окна
		modal.addEventListener('hide.bs.modal', function (event) {
			const modalForm = this.querySelector('form') || false;
			if (!modalForm) throw new Error('not found form into report modal');

			// Сбрасываем значения скрытых полей формы в модальном окне
			hiddenInputs.clearInput(modalForm);
		});
	});
}

/**
 * Устанавливает значения скрытых полей формы в модальном окне.
 * @param {HTMLElement} form - Модальное окно, в котором находятся скрытые поля.
 * @param {Object} objectData - Объект с данными для установки в скрытые поля.
 */
const hiddenInputs = {
	mapCreatedInputs: new WeakMap(),

	setInput(form, objectData) {
		if (!this.mapCreatedInputs.has(form)) this.mapCreatedInputs.set(form, []);

		const inputList = this.mapCreatedInputs.get(form);

		for (const [key, value] of Object.entries(objectData)) {
			// Проверка на дубликаты
			const inputDuplicate = inputList.find((input) => input.id === key);
			if (inputDuplicate) {
				inputDuplicate.value = value;
				continue;
			}

			const nodeInput = document.createElement('input');
			nodeInput.type = 'hidden';
			nodeInput.id = key;
			nodeInput.name = key;
			nodeInput.value = value;

			form.prepend(nodeInput);

			inputList.push(nodeInput);
		}

		this.mapCreatedInputs.set(form, inputList);
	},

	clearInput(form) {
		const inputList = this.mapCreatedInputs.get(form);

		inputList.forEach((input) => {
			input.remove();
		});

		this.mapCreatedInputs.delete(form);
	},
};
