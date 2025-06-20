import { Fancybox } from '@fancyapps/ui';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export default function initSliders() {
	Fancybox.bind('[data-fancybox]', {
		Thumbs: false,
	});

	const productSlider = new Swiper('#productSlider', {
		// configure Swiper to use modules
		modules: [Navigation, Pagination],

		loop: true,
		spaceBetween: 10,
		navigation: {
			nextEl: '.swiper-product .swiper-button-next',
			prevEl: '.swiper-product .swiper-button-prev',
		},
		pagination: {
			el: '.swiper-product .swiper-pagination',
		},
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

			768: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			576: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
		},
	});

	const infoSlider = new Swiper('.info-slider', {
		// configure Swiper to use modules
		modules: [Navigation, Pagination, Autoplay],

		loop: true,
		spaceBetween: 0,
		slidesPerView: 1,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
		speed: 1000,
		navigation: {
			nextEl: '.info-button-next',
			prevEl: '.info-button-prev',
		},
		pagination: {
			el: '.info-slider__pagination',
			clickable: true,
		},
	});
}
