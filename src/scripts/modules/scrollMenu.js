export default function scrollMenu(selector) {
	const staticMenu = document.querySelector(selector);
	const scrollMenu = cloneMenu(staticMenu);
	const search = cloneSearch(scrollMenu);

	document.addEventListener('scroll', () => {
		if (window.scrollY > staticMenu.offsetTop) {
			scrollMenu.classList.add('visible');
		} else {
			scrollMenu.classList.remove('visible');
		}
	});
}

function cloneMenu(menu) {
	if (!menu) {
		throw new Error('Menu not found');
	}

	const clone = menu.cloneNode(true);
	clone.classList.add('scroll-menu');
	clone.dataset.id = 'scroll-menu';

	const link = clone.querySelector('#openSearch');
	link.href = '#search-clone';

	document.body.appendChild(clone);

	return clone;
}
function cloneSearch(menu) {
	const search = document.querySelector('#search');
	const clone = search.cloneNode(true);
	clone.dataset.id = 'search-clone';
	clone.classList.add('mb-4');
	menu.appendChild(clone);

	return clone;
}
