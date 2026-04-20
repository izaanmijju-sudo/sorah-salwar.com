document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header glassmorphism effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Overlay Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const overlayCloseBtn = document.getElementById('overlay-close-btn');
    
    if (mobileMenuBtn && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
        
        overlayCloseBtn.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on link click
        const overlayLinks = mobileOverlay.querySelectorAll('a');
        overlayLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // "Quick Add" visual feedback
    const quickAddBtns = document.querySelectorAll('.quick-add');
    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.innerText;
            btn.innerText = 'Added to Cart';
            btn.style.backgroundColor = '#121212';
            btn.style.color = '#fff';
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                btn.style.color = '#121212';
            }, 2000);
        });
    });

    // Dynamic Product Rendering
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        const category = productContainer.getAttribute('data-category');
        
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                const items = data.items.filter(item => item.category === category);
                productContainer.innerHTML = ''; // clear any loaders
                
                items.forEach(product => {
                    const article = document.createElement('article');
                    article.className = 'product-card';
                    
                    const heartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
                    const plusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
                    const encodedMsg = encodeURIComponent(product.whatsappMessage);
                    
                    article.innerHTML = `
                        <div class="product-image-wrapper">
                            <div class="wishlist-btn">${heartIcon}</div>
                            <img src="${product.image.replace(/^\//, '')}" alt="${product.name}" class="product-image">
                            <a href="https://wa.me/971527467449?text=${encodedMsg}" target="_blank" class="quick-add-btn">
                                ${plusIcon}
                            </a>
                        </div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">${product.price}</p>
                    `;
                    productContainer.appendChild(article);
                });
            })
            .catch(error => {
                console.error("Error loading products:", error);
                productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
            });
    }

    // Netlify Identity Redirect Handlers
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
            if (!user) {
                window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                });
            }
        });
    }
});
