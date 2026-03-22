document.addEventListener('DOMContentLoaded', () => {

    // Subbotones (Hombre / Mujer)
    const subButtons = document.querySelectorAll('.sub-buttons button');

    // Contenedor dinámico donde renderizaremos la galería
    const dynamicGallery = document.getElementById('dynamic-gallery');

    // Añadir clase visual a sub-botones
    subButtons.forEach(b => b.classList.add('sub-btn'));

    // Mapa de categorías -> lista de rutas de imágenes
    const categories = {
        'zapatos-hombre': [
            'zapatos-hombre/zapatos5.jpeg',
            'zapatos-hombre/zapatos6.jpeg',
            'zapatos-hombre/zapatos7.jpeg',
            'zapatos-hombre/zapatos8.jpeg'
        ],
        'zapatos-mujer': [
            'zapatos-mujer/zapatos1.jpeg',
            'zapatos-mujer/zapatos2.jpeg',
            'zapatos-mujer/zapatos3.jpeg',
            'zapatos-mujer/zapatos4.jpeg',
            'zapatos-mujer/zapatos5.jpeg',
            'zapatos-mujer/zapatos6.jpeg',
            'zapatos-mujer/zapatos7.jpeg',
            'zapatos-mujer/zapatos8.jpeg',
            'zapatos-mujer/zapatos9.jpeg',
            'zapatos-mujer/zapatos10.jpeg',
            'zapatos-mujer/zapatos11.jpeg',
            'zapatos-mujer/zapatos12.jpeg',
            'zapatos-mujer/zapatos13.jpeg',
            'zapatos-mujer/zapatos14.jpeg',
            'zapatos-mujer/zapatos15.jpeg',
            'zapatos-mujer/zapatos16.jpeg',
        ],
        'camisetas-hombre': [],
        'camisetas-mujer': [
            'camisetas-mujer/camiseta3.jpeg',
            'camisetas-mujer/camiseta4.jpeg',
            'camisetas-mujer/camiseta5.jpeg',
            'camisetas-mujer/camiseta6.jpeg',
            'camisetas-mujer/camiseta7.jpeg',
            'camisetas-mujer/camiseta8.jpeg',
            'camisetas-mujer/camiseta9.jpeg',
            'camisetas-mujer/camiseta10.jpeg',
            'camisetas-mujer/camiseta11.jpeg',
            'camisetas-mujer/camiseta12.jpeg',
            'camisetas-mujer/camiseta13.jpeg',
            'camisetas-mujer/camiseta14.jpeg',
            'camisetas-mujer/camiseta15.jpeg',
            'camisetas-mujer/camiseta16.jpeg',
            'camisetas-mujer/camiseta17.jpeg',
            'camisetas-mujer/camiseta18.jpeg'
        ],
        'jeans-hombre': [
            'jeans-hombre/JeansHombre1.jpeg',
            'jeans-hombre/JeansHombre2.jpeg',
            'jeans-hombre/JeansHombre3.jpeg',
            'jeans-hombre/JeansHombre4.jpeg',
            'jeans-hombre/JeansHombre5.jpeg',
            'jeans-hombre/JeansHombre6.jpeg',
            'jeans-hombre/JeansHombre7.jpeg',
            'jeans-hombre/Jeans8.jpeg',
            'jeans-hombre/Jeans9.jpeg',
            'jeans-hombre/Jeans10.jpeg',
            'jeans-hombre/Jeans11.jpeg',
            'jeans-hombre/Jeans12.jpeg',
            'jeans-hombre/Jeans13.jpeg',
            'jeans-hombre/Jeans14.jpeg',
            'jeans-hombre/Jeans15.jpeg',
            'jeans-hombre/Jeans16.jpeg',
            'jeans-hombre/Jeans17.jpeg',
            'jeans-hombre/Jeans18.jpeg',
            'jeans-hombre/Jeans19.jpeg',
            'jeans-hombre/Jeans20.jpeg',
            
        ],
        'jeans-mujer': [
            'jeans-mujer/Jeans1.jpeg',
            'jeans-mujer/Jeans2.jpeg',
            'jeans-mujer/Jeans3.jpeg',
            'jeans-mujer/Jeans4.jpeg',
            'jeans-mujer/Jeans5.jpeg',
            'jeans-mujer/Jeans6.jpeg',
            'jeans-mujer/Jeans7.jpeg',
            'jeans-mujer/Jeans8.jpeg',
            'jeans-mujer/Jeans9.jpeg',
            'jeans-mujer/Jeans10.jpeg',
            'jeans-mujer/Jeans11.jpeg',
            'jeans-mujer/Jeans12.jpeg',
            'jeans-mujer/Jeans13.jpeg',
            'jeans-mujer/Jeans14.jpeg',
            'jeans-mujer/Jeans15.jpeg',
            'jeans-mujer/Jeans16.jpeg',
            'jeans-mujer/Jeans17.jpeg',
            'jeans-mujer/Jeans18.jpeg',
            'jeans-mujer/Jeans19.jpeg',
            'jeans-mujer/Jeans20.jpeg',
            'jeans-mujer/Jeans21.jpeg',
            'jeans-mujer/Jeans22.jpeg',
            'jeans-mujer/Jeans23.jpeg',
            'jeans-mujer/Jeans24.jpeg',
            'jeans-mujer/Jeans25.jpeg',
            'jeans-mujer/Jeans26.jpeg',
            'jeans-mujer/Jeans27.jpeg',

        ],
        'accesorios-hombre': [
            'accesorios-hombre/reloj1.jpeg',
            'accesorios-hombre/reloj2.jpeg',
            'accesorios-hombre/reloj3.jpeg',
            'accesorios-hombre/reloj4.jpeg',
            'accesorios-hombre/reloj5.jpeg',
            'accesorios-hombre/billeteria1.jpeg',
            'accesorios-hombre/billetera2.jpeg',
            'accesorios-hombre/billetera3.jpeg',   
        ],
        'accesorios-mujer': [
            'accesorios-mujer/bolso1.jpeg',
            'accesorios-mujer/bolso2.jpeg',
            'accesorios-mujer/bolso3.jpeg',
            'accesorios-mujer/bolso4.jpeg',
            'accesorios-mujer/bolso5.jpeg',
            'accesorios-mujer/bolso6.jpeg',
            'accesorios-mujer/bolso8.jpeg',
            'accesorios-mujer/bolso9.jpeg',
            'accesorios-mujer/bolso10.jpeg',
            'accesorios-mujer/bolso11.jpeg',
            'accesorios-mujer/bolso12.jpeg',
            'accesorios-mujer/bolso13.jpeg',
            'accesorios-mujer/bolso14.jpeg',
           
        ],
        'conjuntos-hombre': [
            'conjuntos-hombre/conjunto1.jpeg',
            'conjuntos-hombre/conjunto2.jpeg',
            'conjuntos-hombre/conjunto3.jpeg',
            'conjuntos-hombre/conjunto4.jpeg',
            'conjuntos-hombre/conjunto5.jpeg',
            'conjuntos-hombre/conjunto6.jpeg',
        ],
        'conjuntos-mujer': [],
        'deporte-hombre': [],
        'deporte-mujer': [],
        'hogar': [
            'UtilesDeHogar/lampara1.jpeg',
            'UtilesDeHogar/lampara2.jpeg',
            'UtilesDeHogar/lampara3.jpeg',
            'UtilesDeHogar/colcha1.jpeg',
            'UtilesDeHogar/colcha2.jpeg',
            'UtilesDeHogar/colcha3.jpeg',
            'UtilesDeHogar/colcha4.jpeg',
            'UtilesDeHogar/colcha5.jpeg',
            'UtilesDeHogar/colcha6.jpeg',
            'UtilesDeHogar/colcha7.jpeg',
            'UtilesDeHogar/colcha8.jpeg',
            'UtilesDeHogar/colcha9.jpeg',
            'UtilesDeHogar/colcha10.jpeg',
            'UtilesDeHogar/colcha11.jpeg',
        ],
    };

    // Limpia la galería dinámica
    function clearGallery() {
        dynamicGallery.innerHTML = '';
        dynamicGallery.classList.remove('visible');
        dynamicGallery.setAttribute('aria-hidden', 'true');
    }

    // Renderiza una categoría (ruta = key en categories)
    function renderCategory(categoryKey) {
        clearGallery();
        const list = categories[categoryKey] || [];

        if (list.length === 0) {
            dynamicGallery.innerHTML = '<p class="placeholder">No hay productos disponibles en esta categoría.</p>';
            dynamicGallery.classList.add('visible');
            dynamicGallery.setAttribute('aria-hidden', 'false');
            dynamicGallery.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const fragment = document.createDocumentFragment();

        list.forEach(src => {
            const prod = document.createElement('div');
            prod.className = 'product';

            const img = document.createElement('img');
            img.src = src;
            img.alt = src.split('/').pop();

            const btn = document.createElement('button');
            btn.className = 'buy-btn';
            btn.dataset.product = img.alt;
            btn.textContent = 'Comprar';

            const cartBtn = document.createElement('button');
            cartBtn.className = 'cart-btn';
            cartBtn.dataset.src = src;
            cartBtn.dataset.product = img.alt;
            cartBtn.textContent = 'Añadir';

            prod.appendChild(img);
            const controls = document.createElement('div');
            controls.className = 'product-controls';
            controls.appendChild(cartBtn);
            controls.appendChild(btn);
            prod.appendChild(controls);
            fragment.appendChild(prod);
        });

        dynamicGallery.appendChild(fragment);
        dynamicGallery.classList.add('visible');
        dynamicGallery.setAttribute('aria-hidden', 'false');
        dynamicGallery.scrollIntoView({ behavior: 'smooth' });
    }

    // Vincular clicks en sub-botones
    subButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            renderCategory(category);
        });
    });

    // --- CARRITO ---
    const cartToggle = document.getElementById('cart-toggle');
    const cartPanel = document.getElementById('cart-panel');
    const cartClose = document.getElementById('cart-close');
    const cartItemsEl = cartPanel.querySelector('.cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const clearCartBtn = document.getElementById('clear-cart');
    const placeOrderBtn = document.getElementById('place-order');

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalItems = cart.reduce((s, i) => s + i.qty, 0);
        cartCount.textContent = totalItems;
        cartTotalEl.textContent = totalItems;
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="placeholder">El carrito está vacío.</p>';
            updateCartCount();
            return;
        }

        cart.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'cart-row';

            const thumb = document.createElement('img');
            thumb.src = item.src;
            thumb.alt = item.name;
            thumb.className = 'cart-thumb';

            const info = document.createElement('div');
            info.className = 'cart-info';
            info.innerHTML = `<div class="cart-name">${item.name}</div>`;

            const qtyWrap = document.createElement('div');
            qtyWrap.className = 'cart-qty';
            qtyWrap.innerHTML = `<button class="qty-decrease" data-idx="${idx}">-</button><span>${item.qty}</span><button class="qty-increase" data-idx="${idx}">+</button>`;

            const remove = document.createElement('button');
            remove.className = 'remove-item';
            remove.dataset.idx = idx;
            remove.textContent = 'Eliminar';

            row.appendChild(thumb);
            row.appendChild(info);
            row.appendChild(qtyWrap);
            row.appendChild(remove);

            cartItemsEl.appendChild(row);
        });

        updateCartCount();
    }

    function addToCart(src, name) {
        const idx = cart.findIndex(i => i.src === src);
        if (idx !== -1) {
            cart[idx].qty += 1;
        } else {
            cart.push({ src, name, qty: 1 });
        }
        saveCart();
        renderCart();
    }

    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
    }

    function placeOrder() {
        if (cart.length === 0) return alert('El carrito está vacío.');

        const phone = '573218920417';
        let text = 'Hola, quiero hacer un pedido de:\n';
        cart.forEach(i => {
            text += `- ${i.name} x${i.qty}\\n`;
        });
        text += `Total items: ${cart.reduce((s,i)=>s+i.qty,0)}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }

    // Abrir/cerrar panel carrito
    cartToggle.addEventListener('click', () => {
        cartPanel.classList.toggle('open');
        cartPanel.setAttribute('aria-hidden', cartPanel.classList.contains('open') ? 'false' : 'true');
        renderCart();
    });
    cartClose.addEventListener('click', () => {
        cartPanel.classList.remove('open');
        cartPanel.setAttribute('aria-hidden', 'true');
    });

    // Delegación de eventos en documento
    document.addEventListener('click', (e) => {
        // Añadir al carrito
        if (e.target.classList.contains('cart-btn')) {
            const src = e.target.dataset.src;
            const name = e.target.dataset.product || src.split('/').pop();
            addToCart(src, name);
            return;
        }

        // Manejo de botones de cantidad y eliminar dentro del carrito
        if (e.target.classList.contains('qty-increase')) {
            const idx = Number(e.target.dataset.idx);
            cart[idx].qty += 1;
            saveCart();
            renderCart();
            return;
        }
        if (e.target.classList.contains('qty-decrease')) {
            const idx = Number(e.target.dataset.idx);
            cart[idx].qty = Math.max(1, cart[idx].qty - 1);
            saveCart();
            renderCart();
            return;
        }
        if (e.target.classList.contains('remove-item')) {
            const idx = Number(e.target.dataset.idx);
            cart.splice(idx, 1);
            saveCart();
            renderCart();
            return;
        }
    });

    clearCartBtn.addEventListener('click', () => clearCart());
    placeOrderBtn.addEventListener('click', () => placeOrder());

    // Inicializar contador desde localStorage
    renderCart();

    // MOSTRAR / OCULTAR SUBBOTONES al pulsar botón principal
    const mainButtons = document.querySelectorAll('.btn-custom');

    mainButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.parentElement;
            const sub = parent.querySelector('.sub-buttons');

            // Cerrar otros menús
            document.querySelectorAll('.sub-buttons').forEach(s => {
                if (s !== sub) s.classList.remove('show');
            });

            // Toggle actual
            if (sub) sub.classList.toggle('show');
        });
    });

    // BOTÓN COMPRAR (WHATSAPP)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            const product = e.target.dataset.product || 'un producto';
            const phone = '573023106951';
            const text = encodeURIComponent(`Hola, quiero comprar ${product} de vertic7.`);
            const url = `https://wa.me/${phone}?text=${text}`;
            window.open(url, '_blank');
        }
    });

});