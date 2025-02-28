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

	const thumbnailSlider = document.querySelector('.thumbnail-slider');
	const childrenThumbnailSlider = [...thumbnailSlider.children].reverse();

	// Устанавливаем класс для последнего видимого элемента в слайдере
	for (const child of childrenThumbnailSlider) {
		if(child.getBoundingClientRect().left < thumbnailSlider.getBoundingClientRect().right) {
			child.classList.add('thumbnail-slider__last')
			break;
		}
	}

	// Устанавливаем css переменные для слайдера
	const containerWidth = document.querySelector('.thumbnail-slider');

	containerWidth.style.setProperty('--container-width', containerWidth.offsetWidth);




	
});


const verticalMenu = document.querySelector('.list-group-widget');
const backgroundItem = verticalMenu.querySelector('.background-item');
let activeMenuItem = verticalMenu.querySelector('.active') || false;

function setBackgroundItem(activeItem) {
	if(!activeMenuItem) return;

	const top = activeItem.offsetTop;
	const left = activeItem.offsetLeft;
	const width = activeItem.offsetWidth;
	const height = activeItem.offsetHeight;

	backgroundItem.style.setProperty('--top-active', top + 'px'); 
	backgroundItem.style.setProperty('--left-active', left + 'px');
	backgroundItem.style.setProperty('--width-active', width + 'px');
	backgroundItem.style.setProperty('--height-active', height + 'px');
}

function handleMenuItemClick(e) {

	const target = e.target;
	if(target.tagName !== 'A') return;

	activeMenuItem.classList.remove('active');
	activeMenuItem = target;
	activeMenuItem.classList.add('active');

	setBackgroundItem(activeMenuItem);
}


function handleMenuItemIn(e) {
	const target = e.target;
	if(target.tagName !== 'A') return;

	activeMenuItem.classList.remove('active');
	setBackgroundItem(target);
}

function handleMenuItemOut(e) {
	const target = e.target;
	if(target.tagName !== 'A') return;

	activeMenuItem.classList.add('active');
	setBackgroundItem(activeMenuItem);
}

setBackgroundItem(activeMenuItem);
verticalMenu.addEventListener('click', handleMenuItemClick);
verticalMenu.addEventListener('mouseover', handleMenuItemIn);
verticalMenu.addEventListener('mouseout', handleMenuItemOut);

