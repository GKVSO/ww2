export default function catalogMenu() {
	const catalogMobileContainer = document.querySelector('.catalog-menu');
	const openMenuBtns = document.querySelectorAll('#open-menu');

	openMenuBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			console.log('test');
			catalogMobileContainer.classList.toggle('show');
		});
	});
}
