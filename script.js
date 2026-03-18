document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-category]');
    
    // Mapeo de IDs de las secciones del HTML
    const galleries = {
        zapatos: document.getElementById('gallery-zapatos'),
        camisetas: document.getElementById('gallery-camisetas'),
        jeans: document.getElementById('gallery-jeans'),
        accesorios: document.getElementById('gallery-accesorios'),
        conjuntos: document.getElementById('gallery-conjuntos'),
        ropaDeportiva: document.getElementById('gallery-ropa-deportiva'),
        utilesDelHogar: document.getElementById('gallery-utiles-del-hogar')
    };

    // Función para ocultar todas las galerías y quitar estado activo de botones
    function resetState() {
        // Ocultar galerías
        Object.values(galleries).forEach(g => {
            if (g) {
                g.classList.remove('visible');
                g.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Quitar clase activa de todos los botones
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    // Evento para los botones de categorías
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            const gallery = galleries[cat];

            if (gallery) {
                const isAlreadyVisible = gallery.classList.contains('visible');
                
                resetState(); // Limpia todo

                if (!isAlreadyVisible) {
                    // Activa la galería y el botón actual
                    gallery.classList.add('visible');
                    gallery.setAttribute('aria-hidden', 'false');
                    btn.classList.add('active'); // Marca el botón como activo

                    // Scroll suave hacia los productos, con un pequeño margen superior
                    const yOffset = -20; 
                    const y = gallery.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({top: y, behavior: 'smooth'});
                }
            }
        });
    });

    // Evento delegado para el botón de WhatsApp (Compra)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            const product = e.target.dataset.product || 'un producto';
            const phone = '573023106951';
            const text = encodeURIComponent(`Hola, quiero comprar ${product} de vertic7.`);
            const waUrl = `https://wa.me/${phone}?text=${text}`;
            window.open(waUrl, '_blank');
        }
    });
});