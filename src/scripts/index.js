import { Collapse , Dropdown } from 'bootstrap';
import handleDropMenu from './modules/handleDropMenu.js';
import initSliders from './modules/initSliders.js';
import setCSSVariables from './modules/setCSSVariables.js';
import initTimeline from './modules/initTimeline.js';

window.collapse = Collapse;

document.addEventListener('DOMContentLoaded', () => {
	// Инициализируем слайдеры
	initSliders();

	// Задаем свойства для css переменных
	setCSSVariables();

	// Обрабатываем нажатие на выпадающие меню
	handleDropMenu();

	// Init timeline 
	initTimeline();

	// Инициализируем кастомные выпадающие меню
	if(window.innerWidth < 992) {
		const footerTitle = document.querySelectorAll('.footer__title');
		footerTitle.forEach(title => {
			title.collapse = new Collapse(title.nextElementSibling, {
				toggle: false
			});

			title.addEventListener('click', function() {
				this.classList.toggle('active')
				this.collapse.toggle();
			})
		})
	}

	// Event listener for collapse menu
	const collapseHeaderButton = document.querySelector('#collapseHeaderButton');
	const collapseHeaderMenus = [...document.querySelectorAll('.header-navbar-collapse')]
		.map(menu => new Collapse(menu, {toggle: false}));
	
	collapseHeaderButton.addEventListener('click', function() {
		collapseHeaderMenus.forEach(menu => menu.toggle());
	})
});
