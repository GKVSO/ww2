export default function btnLike() {
	const btns = document.querySelectorAll('.btn-like');

	if (!btns) return false;

	btns.forEach((btn) => {
		btn.addEventListener('click', function () {
			this.classList.toggle('active');
		});
	});
}
