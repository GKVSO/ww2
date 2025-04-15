export default function () {
	const targetBlocks = document.querySelectorAll('.message-item__message');
	let isSelection = false;

	document.addEventListener('scroll', hiddenQuoteBtn);
	document.addEventListener('mousedown', hiddenQuoteBtn);

	document.addEventListener('selectionchange', () => {
		const selection = getSelection();

		if (selection.rangeCount === 0) {
			isSelection = false;
			hiddenQuoteBtn();
			return false;
		}

		let startNode = selection.anchorNode;
		if (startNode.nodeName === '#text') {
			startNode = startNode.parentNode;
		}
		startNode = startNode.closest('.message-item__message');

		let endNode = selection.focusNode;
		if (endNode.nodeName === '#text') {
			endNode = endNode.parentNode;
		}
		endNode = endNode.closest('.message-item__message');

		if (startNode !== endNode) {
			isSelection = false;
			hiddenQuoteBtn();
			return false;
		}

		if (selection.isCollapsed) {
			isSelection = false;
			hiddenQuoteBtn();
			return false;
		}

		if (startNode) {
			isSelection = true;
		}
	});
	targetBlocks.forEach((target) => {
		target.addEventListener('mouseup', selectionHandler);
		target.addEventListener('touchend', selectionHandler);
	});

	function hiddenQuoteBtn() {
		const quoteBtn = document.querySelector('.quote-btn');

		if (event.target === quoteBtn) return false;

		if (quoteBtn) {
			quoteBtn.classList.remove('active');
		}
	}

	function selectionHandler() {
		if (!isSelection) return false;

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

		let quoteBtn = document.querySelector('.quote-btn');

		if (!quoteBtn) {
			quoteBtn = document.createElement('button');
			quoteBtn.classList.add('quote-btn', 'btn', 'active');
			quoteBtn.id = 'quoteFloatBtn';

			// Добавляем SVG иконку и текст
			quoteBtn.innerHTML = `
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

			document.body.appendChild(quoteBtn);
		}

		quoteBtn.classList.add('active');
		quoteBtn.style.setProperty('--top', `${top}px`);
		quoteBtn.style.setProperty('--left', `${left}px`);
	}

	function getSelection() {
		const selection = window.getSelection();

		// Проверяем, тройной ли это был щелчек
		if (
			selection.anchorNode !== selection.focusNode &&
			selection.anchorOffset === 1 &&
			selection.focusOffset === 0
		) {
			selection.extend(selection.anchorNode, selection.anchorNode.length);
		}

		return selection;
	}
}
