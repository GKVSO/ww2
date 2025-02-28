export default function resize(fn, ...args) {
	fn(...args);

	window.addEventListener('resize', () => {
		fn(...args);
	});
}
