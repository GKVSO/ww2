import { Collapse , Dropdown } from 'bootstrap';
import handleDropMenu from './modules/handleDropMenu.js';
import initSliders from './modules/initSliders.js';
import setCSSVariables from './modules/setCSSVariables.js';
import initTimeline from './modules/initTimeline.js';

document.addEventListener('DOMContentLoaded', () => {
	// Инициализируем слайдеры
	initSliders();

	// Задаем свойства для css переменных
	setCSSVariables();

	// Обрабатываем нажатие на выпадающие меню
	handleDropMenu();

	// Init timeline 
	initTimeline();
});
