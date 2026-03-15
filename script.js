document.addEventListener('DOMContentLoaded', () => {
	const buttons = document.querySelectorAll('[data-category]');
	const galleries = {
		zapatos: document.getElementById('gallery-zapatos'),
		camisetas: document.getElementById('gallery-camisetas'),
		jeans: document.getElementById('gallery-jeans'),
		conjuntos: document.getElementById('gallery-conjuntos'),
		ropaDeportiva: document.getElementById('gallery-ropa-deportiva'),
		utilesDelHogar: document.getElementById('gallery-utiles-del-hogar'),
		accesorios: document.getElementById('gallery-accesorios')
	};

	function hideAll() {
		Object.values(galleries).forEach(g => {
			if (!g) return;
			g.classList.remove('visible');
			g.setAttribute('aria-hidden', 'true');
		});
	}

	function toggleCategory(cat) {
		const gallery = galleries[cat];
		if (!gallery) return;
		const isVisible = gallery.classList.contains('visible');
		hideAll();
		if (!isVisible) {
			gallery.classList.add('visible');
			gallery.setAttribute('aria-hidden', 'false');
			gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			const cat = btn.dataset.category;
			toggleCategory(cat);
		});
	});

	// Manejar botón de compra: redirige a WhatsApp con mensaje prellenado
	document.addEventListener('click', (e) => {
		if (!e.target.classList.contains('buy-btn')) return;
		e.preventDefault();
		const product = e.target.dataset.product || 'producto';
		const phone = '573023106951'; // número sin '+' y sin espacios
		const text = encodeURIComponent(`Hola, quiero comprar ${product} de vertic7.`);
		const waUrl = `https://wa.me/${phone}?text=${text}`;
		window.open(waUrl, '_blank');
	});
});
