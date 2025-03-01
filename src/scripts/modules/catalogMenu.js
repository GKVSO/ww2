export default function catalogMenu() {
	const catalogMobileContainer = document.querySelector('.catalog-menu');
	const openMenuBtns = document.querySelectorAll('#open-menu');

	const catalog = document.querySelector('#catalog');
	const cloneCatalog = cloneMenu(catalog, catalogMobileContainer);

	openMenuBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			catalogMobileContainer.classList.toggle('show');
		});
	});
}

function cloneMenu(menu, cloneTo) {
	if (!menu) {
		throw new Error('Menu not found');
	}

	const clone = menu.cloneNode(true);
	clone.classList.remove('collapse');
	cloneTo.appendChild(clone);

	return clone;
}
