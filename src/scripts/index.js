import { Collapse, Dropdown, Modal } from 'bootstrap';
import handleDropMenu from './modules/handleDropMenu.js';
import initSliders from './modules/initSliders.js';
import setCSSVariables from './modules/setCSSVariables.js';
import initTimeline from './modules/initTimeline.js';
import initDynamicMenu from './modules/dynamicMenu.js';
import initThumbnailSlider from './modules/thumbnailSlider.js';
import resize from './modules/resize.js';
import scrollMenu from './modules/scrollMenu.js';
import catalogMenu from './modules/catalogMenu.js';
import accountMenu from './modules/accountMenu.js';
import toggleCurrentOrder from './modules/toggleCurrentOrder.js';
import labelAnimation from './modules/labelAnimation.js';
import togglePass from './modules/togglePass.js';
import inputClear from './modules/inputClear.js';
import btnLike from './modules/btnLike.js';
import fancyWebp from './modules/fancyWebp.js';
import inputMaskPhone from './modules/inputMaskPhone.js';
import removeProductFromOrder from './modules/removeProductFromOrder.js';
import uploadImage from './modules/uploadImage.js';
import messages from './modules/messages/messages.js';
import inputCounter from './modules/messages/inputCounter.js';
import inputAutoExpand from './modules/inputAutoExpand.js';
import popUp from './modules/messages/popUp.js';
import inputSelect from './modules/inputSelect.js';
import { Fancybox } from '@fancyapps/ui';
import { initBoughtItemsSlider } from './modules/boughtItemsSlider.js';

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
		// Init remove product from order
		removeProductFromOrder();
	} catch (error) {
		console.error('Error initializing remove product from order:', error);
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
		// Init upload image
		uploadImage(['#uploadImage']);
	} catch(error) {
		console.error('Error initializing upload image:', error);
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

	// Collapse header menusw
	const collapseHeaderButton = document.querySelector('#collapseHeaderButton');
	const collapseHeaderMenus = [...document.querySelectorAll('.header-navbar-collapse')]
		.map(menu => new Collapse(menu, {toggle: false}));
	
	collapseHeaderButton.addEventListener('click', function() {
		collapseHeaderMenus.forEach(menu => menu.toggle());
	})

	try {
		// Init scroll menu
		catalogMenu();
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

	// Координаты центра карты
	const myLatLng = {lat: 55.832095, lng: 37.483957}; // Например, Москва

	// Создание карты
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 17, // Уровень масштабирования
		center: myLatLng, // Центр карты
		styles: [
			{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#e9e9e9"
							},
							{
									"lightness": 17
							}
					]
			},
			{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#f5f5f5"
							},
							{
									"lightness": 20
							}
					]
			},
			{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
							{
									"color": "#ffffff"
							},
							{
									"lightness": 17
							}
					]
			},
			{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
							{
									"color": "#ffffff"
							},
							{
									"lightness": 29
							},
							{
									"weight": 0.2
							}
					]
			},
			{
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#ffffff"
							},
							{
									"lightness": 18
							}
					]
			},
			{
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#ffffff"
							},
							{
									"lightness": 16
							}
					]
			},
			{
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#f5f5f5"
							},
							{
									"lightness": 21
							}
					]
			},
			{
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#dedede"
							},
							{
									"lightness": 21
							}
					]
			},
			{
					"elementType": "labels.text.stroke",
					"stylers": [
							{
									"visibility": "on"
							},
							{
									"color": "#ffffff"
							},
							{
									"lightness": 16
							}
					]
			},
			{
					"elementType": "labels.text.fill",
					"stylers": [
							{
									"saturation": 36
							},
							{
									"color": "#333333"
							},
							{
									"lightness": 40
							}
					]
			},
			{
					"elementType": "labels.icon",
					"stylers": [
							{
									"visibility": "off"
							}
					]
			},
			{
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [
							{
									"color": "#f2f2f2"
							},
							{
									"lightness": 19
							}
					]
			},
			{
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [
							{
									"color": "#fefefe"
							},
							{
									"lightness": 20
							}
					]
			},
			{
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [
							{
									"color": "#fefefe"
							},
							{
									"lightness": 17
							},
							{
									"weight": 1.2
							}
					]
			}
	]
	});

	// Добавление маркера
	const marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
    clickable: true, // Делаем кликабельным (по умолчанию true)
		icon: {
			url: '../assets/images/google-mark1.png',
			scaledSize: new google.maps.Size(30, 30)
		}
	});
	// Инфо-окно
	const infoWindow = new google.maps.InfoWindow({
		content: "Ленинградское шоссе 37 корп.1, г.Москва"
	});

	// Обработчик клика
	marker.addListener('click', () => {
		infoWindow.open(map, marker);
	});


	
});
