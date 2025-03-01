import { Collapse , Dropdown } from 'bootstrap';
import handleDropMenu from './modules/handleDropMenu.js';
import initSliders from './modules/initSliders.js';
import setCSSVariables from './modules/setCSSVariables.js';
import initTimeline from './modules/initTimeline.js';
import initDynamicMenu from './modules/dynamicMenu.js';
import initThumbnailSlider from './modules/thumbnailSlider.js';
import resize from './modules/resize.js';
import scrollMenu from './modules/scrollMenu.js';
import catalogMenu from './modules/catalogMenu.js';

window.collapse = Collapse;

document.addEventListener('DOMContentLoaded', () => {
	try {
		// Инициализируем слайдеры
		initSliders();
	} catch (error) {
		console.error('Error initializing sliders:', error);
	}

	try {
		// Задаем свойства для css переменных
		resize(setCSSVariables);
	} catch (error) {
		console.error('Error setting CSS variables:', error);
	}

	try {
		// Обрабатываем нажатие на выпадающие меню
		resize(handleDropMenu);
	} catch (error) {
		console.error('Error handling drop menu:', error);
	}

	try {
		// Init timeline 
		initTimeline();
	} catch (error) {
		console.error('Error initializing timeline:', error);
	}

	try {
		// Init dynamic menu
		resize(initDynamicMenu);
	} catch (error) {
		console.error('Error initializing dynamic menu:', error);
	}

	try {
		// Init thumbnail slider
		resize(initThumbnailSlider);
	} catch (error) {
		console.error('Error initializing thumbnail slider:', error);
	}

	

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


	// Catalog menu
	if(window.innerWidth < 768) {
		try {
			// Init scroll menu
			scrollMenu('#scroll-menu');
		} catch (error) {
			console.error('Error initializing scroll menu:', error);
		}
		
		try {
			// Init scroll menu
			catalogMenu();
		} catch (error) {
			console.error('Error initializing catalog menu:', error);
		}

		// Collapsing catalog menu item
		const catalogMenuItems = document.querySelectorAll('.catalog-menu .navbar-nav_drop > .nav-item');

		console.log(catalogMenuItems)

		catalogMenuItems.forEach(item => {
			const tabContent = item.querySelector('.tab-content');
			if(!tabContent) return;

			item.collapse = new Collapse(tabContent, {toggle: false});
			tabContent.classList.add('collapse');

			item.addEventListener('click', function(e) {
				if(e.target.nodeName === 'A') {
					e.preventDefault();
					this.collapse.toggle();
				}
			})
		})
	}	
	
});


