export default function btnLike() {
	const btns = document.querySelectorAll('.btn-like');

	if (!btns) return false;

	btns.forEach((btn) => {
		btn.addEventListener('click', function (event) {
			this.classList.toggle('active');

			if (this.classList.contains('active')) {
				heartAnimation(event);
			}
		});
	});
}

// Вспомогательные функции
const angleTools = {
	getAngle: function (t, n) {
		var a = n.x - t.x,
			e = n.y - t.y;
		return (Math.atan2(e, a) / Math.PI) * 180;
	},
	getDistance: function (t, n) {
		var a = t.x - n.x,
			e = t.y - n.y;
		return Math.sqrt(a * a + e * e);
	},
	moveOnAngle: function (t, n) {
		var a = this.getOneFrameDistance(t, n);
		(t.x += a.x), (t.y += a.y);
	},
	getOneFrameDistance: function (t, n) {
		return {
			x: n * Math.cos((t.rotation * Math.PI) / 180),
			y: n * Math.sin((t.rotation * Math.PI) / 180),
		};
	},
};

function r(a, b, c) {
	return parseFloat(
		(Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(
			c ? c : 0
		)
	);
}

// Константы
const PARTICLES_COUNT = 15;
const PARTICLE_COLOR = { r: 54, g: 123, b: 197 }; // RGB значения из оригинального цвета

function heartAnimation(event) {
	var x = event.clientX;
	var y = event.clientY;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var ratio = window.devicePixelRatio;
	var particles = [];

	document.body.appendChild(canvas);

	canvas.style.position = 'fixed';
	canvas.style.left = x - 50 + 'px';
	canvas.style.top = y - 50 + 'px';
	canvas.style.pointerEvents = 'none';
	canvas.style.width = 100 + 'px';
	canvas.style.height = 100 + 'px';
	canvas.width = 100 * ratio;
	canvas.height = 100 * ratio;

	// Создает частицу
	function Particle() {
		const opacity = r(0, 0.5, true);
		return {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 10,
			color: `rgba(${PARTICLE_COLOR.r}, ${PARTICLE_COLOR.g}, ${PARTICLE_COLOR.b}, ${opacity})`,
			rotation: r(0, 360, true),
			speed: 4,
			friction: 0.9,
			opacity: opacity,
			yVel: 0,
			gravity: 0,
		};
	}

	// Создает частицы
	for (var i = 0; ++i < PARTICLES_COUNT; ) {
		particles.push(Particle());
	}

	function render() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach(function (p, i) {
			angleTools.moveOnAngle(p, p.speed);

			p.opacity -= 0.01;
			p.speed *= p.friction;
			p.radius *= p.friction;

			p.yVel += p.gravity;
			p.y += p.yVel;

			if (p.opacity < 0) return;
			if (p.radius < 0) return;

			context.beginPath();
			context.fillStyle = `rgba(${PARTICLE_COLOR.r}, ${PARTICLE_COLOR.g}, ${PARTICLE_COLOR.b}, ${p.opacity})`;
			context.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
			context.fill();
		});
	}

	(function renderLoop() {
		requestAnimationFrame(renderLoop);
		render();
	})();

	setTimeout(function () {
		document.body.removeChild(canvas);
	}, 3000);
}
