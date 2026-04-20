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

    // Simple mobile menu toggle (for demonstration)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Very rudimentary mobile toggle just for visual feedback.
            // A more complex app would use a proper slide-out drawer here.
            const isDisplayed = navLinks.style.display === 'flex';
            if (isDisplayed) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(250, 249, 246, 0.95)';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.padding = '2rem';
                navLinks.style.textAlign = 'center';
                navLinks.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
            }
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
                    
                    const waIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
                    const encodedMsg = encodeURIComponent(product.whatsappMessage);
                    
                    article.innerHTML = `
                        <div class="product-image-wrapper">
                            <img src="${product.image.replace(/^\//, '')}" alt="${product.name}" class="product-image">
                            <a href="https://wa.me/971527467449?text=${encodedMsg}" target="_blank" class="whatsapp-btn">
                                ${waIcon} Inquire
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
