import { Collapse, Dropdown, Modal } from 'bootstrap';
import initSliders from './modules/initSliders.js';
import setCSSVariables from './modules/setCSSVariables.js';
import initTimeline from './modules/initTimeline.js';
import initDynamicMenu from './modules/dynamicMenu.js';
import initThumbnailSlider from './modules/thumbnailSlider.js';
import resize from './modules/resize.js';
import scrollMenu from './modules/scrollMenu.js';
import {toggleCatalogMenu, createDropdownFunction} from './modules/catalogMenu.js';
import accountMenu from './modules/accountMenu.js';
import toggleCurrentOrder from './modules/toggleCurrentOrder.js';
import labelAnimation from './modules/labelAnimation.js';
import togglePass from './modules/togglePass.js';
import inputClear from './modules/inputClear.js';
import btnLike from './modules/btnLike.js';
import fancyWebp from './modules/fancyWebp.js';
import inputMaskPhone from './modules/inputMaskPhone.js';
import messages from './modules/messages/messages.js';
import inputCounter from './modules/messages/inputCounter.js';
import inputAutoExpand from './modules/inputAutoExpand.js';
import popUp from './modules/messages/popUp.js';
import inputSelect from './modules/inputSelect.js';
import { Fancybox } from '@fancyapps/ui';
import { initBoughtItemsSlider } from './modules/boughtItemsSlider.js';
import catalogTopNavigation from './modules/catalogTopNavigation.js';


window.collapse = Collapse;

document.addEventListener('DOMContentLoaded', () => {
	try {
		// Инициализируем слайдеры		
		initSliders();
	} catch (error) {
		console.error('Error initializing sliders:', error);
	}

	try {
	    catalogTopNavigation();
	} catch (error) {
	    console.error('Error initializing catalog navigation:', error);
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

	try {
		// Init thumbnail slider
		accountMenu('.left-bar__menu.lk_menu');
	} catch (error) {
		console.error('Error initializing account menu:', error);
	}

	try {
		// Init toggle current orders
		toggleCurrentOrder();
	} catch (error) {
		console.error('Error initializing toggle current orders:', error);
	}


	try {
		// Label animation check
		labelAnimation();
	} catch (error) {
		console.error('Error initializing label animation:', error);
	}

	try {
		// Init toggle pass input btn
		togglePass();
	} catch (error) {
		console.error('Error initializing togglePass:', error);
	}

	try {
		// Init input clear btn
		inputClear();
	} catch (error) {
		console.error('Error initializing input clear btn:', error);
	}

	try {
		// Init btn like
		btnLike();
	} catch (error) {
		console.error('Error initializing btn like:', error);
	}

	try {
		// Init fancy webp
		fancyWebp();
	} catch (error) {
		console.error('Error initializing fancyWebp:', error);
	}

	try {
		// Init input mask phone
		inputMaskPhone();
	} catch (error) {
		console.error('Error initializing input mask phone:', error);
	}

	try {
		// Init input auto expand
		inputAutoExpand('.auto-expand');
	} catch (error) {
		console.error('Error initializing input auto expand:', error);
	}

	try {
		// Инициализируем слайдер купленных предметов
		initBoughtItemsSlider();
	} catch (error) {
		console.error('Error initializing bought items slider:', error);
	}


	try {
		const openGallery = document.querySelector('#openGallery')
		openGallery.addEventListener('click', function() {
			Fancybox.fromSelector('[data-fancybox="gallery"]');
		})
	} catch(error) {
		console.error('Error initializing open gallery btn:', error);
	}

	try {
		// Init messages
		messages();
	} catch(error) {
		console.error('Error initializing messages:', error);
	}

	try {
		// Init input counter
		inputCounter();
	} catch(error) {
		console.error('Error initializing input counter:', error);
	}

	try {
		// Init input popUp
		popUp();
	} catch(error) {
		console.error('Error initializing input popUp:', error);
	}

	try {
		// Init input select
		inputSelect();
	} catch(error) {
		console.error('Error initializing input select:', error);
	}

	// Collapse footer menus
	if(window.innerWidth < 992) {
		const collapseNextElement = (selector) => {
			const nodes = document.querySelectorAll(selector);
			nodes.forEach(node => {
				node.collapse = new Collapse(node.nextElementSibling, {
					toggle: false
				});

				node.addEventListener('click', function(event) {
					event.preventDefault()
					this.classList.toggle('active')
					this.collapse.toggle();
				})
			})
		}
		collapseNextElement('.footer__title')
		
	}

	// Collapse header menusw
	const collapseHeaderButton = document.querySelector('#collapseHeaderButton');
	const collapseHeaderMenus = [...document.querySelectorAll('.header-navbar-collapse')]
		.map(menu => new Collapse(menu, {toggle: false}));
	
	collapseHeaderButton.addEventListener('click', function() {
		collapseHeaderMenus.forEach(menu => menu.toggle());
	})

	try {
		// Init scroll menu
		toggleCatalogMenu();
		const toggleCategoryItem = createDropdownFunction(
			'.catalog-menu .navbar-nav_drop > .nav-item'
		);
		const toggleSubCategoryItem = createDropdownFunction(
			'.catalog-menu .sub-category'
		);
		toggleCategoryItem();
		toggleSubCategoryItem();
	} catch (error) {
		console.error('Error initializing catalog menu:', error);
	}

	try {
		// Init scroll menu
		scrollMenu('#scroll-menu');
	} catch (error) {
		console.error('Error initializing scroll menu:', error);
	}

	// Collapsing catalog menu item
	const catalogMenuItems = document.querySelectorAll('.catalog-menu .navbar-nav_drop > .nav-item');

	// console.log(catalogMenuItems)

	// Кнопка запомнить при входе
    const remember = document.getElementById('remember');
    const css = document.getElementById('remember-line');

    remember.addEventListener('change', function(e) {
        if (e.target.checked === true) {
            css.classList.add('active-remember');
        } 
        if (e.target.checked === false) {
            css.classList.remove('active-remember');
        }
    })

});
