import { Collapse , Dropdown } from 'bootstrap';
import handleDropMenu from './modules/handleDropMenu.js';
import initSliders from './modules/initSliders.js';
import setCSSVariables from './modules/setCSSVariables.js';
import initTimeline from './modules/initTimeline.js';
import initDynamicMenu from './modules/dynamicMenu.js';
import initThumbnailSlider from './modules/thumbnailSlider.js';

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

	// Init dynamic menu
	initDynamicMenu();

	// Init thumbnail slider
	initThumbnailSlider();

	// Collapse footer menus
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

	// Collapse header menus
	const collapseHeaderButton = document.querySelector('#collapseHeaderButton');
	const collapseHeaderMenus = [...document.querySelectorAll('.header-navbar-collapse')]
		.map(menu => new Collapse(menu, {toggle: false}));
	
	collapseHeaderButton.addEventListener('click', function() {
		collapseHeaderMenus.forEach(menu => menu.toggle());
	})
});


