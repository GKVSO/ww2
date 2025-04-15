export default function () {
	const modals = document.querySelectorAll('.modal');

	modals.forEach((modal) => {
		modal.addEventListener('show.bs.modal', function (event) {
			console.log('test');
			const htmlNode = document.documentElement;
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;

			htmlNode.style.overflow = 'clip';
			htmlNode.style.paddingRight = `${scrollbarWidth}px`;
		});

		modal.addEventListener('hide.bs.modal', function (event) {
			const htmlNode = document.documentElement;
			const scrollbarWidth =
				window.innerWidth - document.documentElement.clientWidth;

			htmlNode.style.overflow = 'auto';
			htmlNode.style.paddingRight = '';
		});
	});
}
