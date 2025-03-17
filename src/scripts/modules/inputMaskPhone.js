export default function inputMaskPhone() {
	const input = document.querySelector('.maskphone');

	input.addEventListener('input', mask);
	input.addEventListener('focus', mask);
	input.addEventListener('blur', mask);

	/***/
	function mask(event) {
		var blank = '+_ (___) ___-__-__';

		var i = 0;
		var val = this.value.replace(/\D/g, '').replace(/^8/, '7'); // <---

		this.value = blank.replace(/./g, function (char) {
			if (/[_\d]/.test(char) && i < val.length) return val.charAt(i++);

			return i >= val.length ? '' : char;
		});

		if (event.type == 'blur') {
			if (this.value.length == 2) this.value = '';
		} else {
			setCursorPosition(this, this.value.length);
		}
	}

	/***/
	function setCursorPosition(elem, pos) {
		elem.focus();

		if (elem.setSelectionRange) {
			elem.setSelectionRange(pos, pos);
			return;
		}

		if (elem.createTextRange) {
			var range = elem.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
			return;
		}
	}
}
