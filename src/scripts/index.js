import { Dropdown, Collapse, Tooltip, Toast, Tab, Modal } from 'bootstrap';

import Swiper from 'swiper';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';

import { Fancybox } from '@fancyapps/ui';

Fancybox.bind('[data-fancybox]', {
	Thumbs: false,
});

// init Swiper:
// const productSliderThumb = new Swiper('#productSliderThumbnails', {
// 	loop: true,
// 	spaceBetween: 10,
// 	slidesPerView: 4,
// 	freeMode: true,
// 	watchSlidesProgress: true,
// });

const productSlider = new Swiper('#productSlider', {
	// configure Swiper to use modules
	modules: [Navigation, Thumbs, Pagination],

	loop: true,
	spaceBetween: 10,
	navigation: {
		nextEl: '.swiper-product .swiper-button-next',
		prevEl: '.swiper-product .swiper-button-prev',
	},
	pagination: {
		el: '.swiper-product .swiper-pagination',
	},
	// thumbs: {
	// 	swiper: productSliderThumb,
	// },
});

const servicesSlider = new Swiper('.services-slider', {
	// configure Swiper to use modules
	modules: [Navigation, Pagination],

	// loop: true,
	spaceBetween: 20,
	slidesPerView: 1,
	navigation: {
		nextEl: '.services-button-next',
		prevEl: '.services-button-prev',
	},
	pagination: {
		el: '.services-slider .swiper-pagination',
		type: 'progressbar',
	},

	breakpoints: {
		1199: {
			slidesPerView: 4,
			spaceBetween: 20,
		},

		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		576: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
	},
});

function setCSSVariables() {
	const containerWidth = document.querySelector('#headerNav').offsetWidth;
	document.documentElement.style.setProperty(
		'--container-width',
		`${containerWidth}px`
	);

	const navDropdownTop = document.querySelector('.navbar-drop').offsetHeight;
	document.documentElement.style.setProperty(
		'--nav-dropdown-top',
		`${navDropdownTop}px`
	);

	const navDropdownLeft = document.querySelector('#headerNav').offsetLeft;
	document.documentElement.style.setProperty(
		'--nav-dropdown-left',
		`${navDropdownLeft}px`
	);
}

setCSSVariables();

// window.addEventListener('resize', setContainerWidth);

// Если у пользователя тач скрин
// if ('ontouchstart' in window || navigator.maxTouchPoints) {
// 	let lastTappedLink = null;

// 	document.querySelectorAll('a').forEach((link) => {
// 		link.addEventListener(
// 			'touchstart',
// 			function (event) {
// 				if (lastTappedLink && lastTappedLink !== this) {
// 					lastTappedLink.dataset.tapCount = 0;
// 				}

// 				let tapCount = parseInt(this.dataset.tapCount, 10) || 0;
// 				if (tapCount === 0) {
// 					event.preventDefault();
// 					this.dataset.tapCount = 1;
// 					lastTappedLink = this;
// 					setTimeout(() => {
// 						if (lastTappedLink === this) {
// 							this.dataset.tapCount = 0;
// 						}
// 					}, 1000); // Сброс через 1 сек
// 				}
// 			},
// 			{ passive: false }
// 		);
// 	});
// }

document.addEventListener('DOMContentLoaded', () => {
	// Если у пользователя тач скрин
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
});
