import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export const initBoughtItemsSlider = () => {
	console.log('initBoughtItemsSlider');
	const boughtItemsSlider = new Swiper('.bought-slider', {
		modules: [Navigation, Pagination, Autoplay],
		slidesPerView: 1,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.bought-slider__pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.bought-slider__next',
			prevEl: '.bought-slider__prev',
		},
	});
};
