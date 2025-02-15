export default function handleDropMenu() {
	if ('ontouchstart' in window || navigator.maxTouchPoints) {
		let preventClick = null;

		// Берем все ссылки с выпадающего меню
		const dropdownMenu = document.querySelectorAll(
			'#catalog ul.navbar-nav > li > a'
		);

		// Вешаем на ссылки обработчики
		dropdownMenu.forEach((link) => {
			link.addEventListener('click', function (event) {
				// Если, это первый клик на ссылку, то не переходим по ней
				if (this !== preventClick) {
					event.preventDefault();
					preventClick = this;
				}
			});
		});
	}
}
