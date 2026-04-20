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

    // Grid View Toggle (1-column vs 2-column)
    const view1Btn = document.getElementById('view-1');
    const view2Btn = document.getElementById('view-2');
    const pGrid = document.querySelector('.product-grid');

    if (view1Btn && view2Btn && pGrid) {
        view1Btn.addEventListener('click', () => {
            pGrid.classList.add('grid-1');
            view1Btn.classList.add('active');
            view2Btn.classList.remove('active');
        });

        view2Btn.addEventListener('click', () => {
            pGrid.classList.remove('grid-1');
            view2Btn.classList.add('active');
            view1Btn.classList.remove('active');
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

    // Dynamic Product Rendering with Sorting
    const productContainer = document.getElementById('product-container');
    const sortDrawer = document.getElementById('sort-drawer');
    const filterDrawer = document.getElementById('filter-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const sortBtn = document.getElementById('sort-btn');
    const filterBtn = document.getElementById('filter-btn');
    const sortClose = document.getElementById('sort-close');
    const filterClose = document.getElementById('filter-close');

    let allCategoryItems = [];

    function displayProducts(products) {
        if (!productContainer) return;
        productContainer.innerHTML = '';
        
        products.forEach(product => {
            const article = document.createElement('article');
            article.className = 'product-card';
            
            const encodedMsg = encodeURIComponent(product.whatsappMessage);
            
            article.innerHTML = `
                <a href="https://wa.me/971527467449?text=${encodedMsg}" target="_blank" style="text-decoration: none; color: inherit;">
                    <div class="product-image-wrapper">
                        <img src="${product.image.replace(/^\//, '')}" alt="${product.name}" class="product-image">
                    </div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                </a>
            `;
            productContainer.appendChild(article);
        });
    }

    if (productContainer) {
        // Force 2-column by default on mobile for 'Boutique' feel
        pGrid.classList.remove('grid-1');
        if (view2Btn) view2Btn.classList.add('active');
        if (view1Btn) view1Btn.classList.remove('active');

        const category = productContainer.getAttribute('data-category');
        
        fetch('data/products.json')
            .then(response => response.json())
            .then(data => {
                allCategoryItems = data.items.filter(item => item.category === category);
                displayProducts(allCategoryItems);
            })
            .catch(error => {
                console.error("Error loading products:", error);
                productContainer.innerHTML = '<p>Error loading products.</p>';
            });
    }

    // Drawer Controls
    function openDrawer(drawer) {
        drawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeAllDrawers() {
        sortDrawer.classList.remove('active');
        filterDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sortBtn) sortBtn.addEventListener('click', () => openDrawer(sortDrawer));
    if (filterBtn) filterBtn.addEventListener('click', () => openDrawer(filterDrawer));
    if (sortClose) sortClose.addEventListener('click', closeAllDrawers);
    if (filterClose) filterClose.addEventListener('click', closeAllDrawers);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeAllDrawers);

    // Sorting Logic
    const sortOptions = document.querySelectorAll('#sort-drawer li');
    sortOptions.forEach(option => {
        option.addEventListener('click', () => {
            const sortType = option.getAttribute('data-sort');
            
            // UI Update
            sortOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');

            let sortedItems = [...allCategoryItems];

            if (sortType === 'price-low') {
                sortedItems.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
                    return priceA - priceB;
                });
            } else if (sortType === 'price-high') {
                sortedItems.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
                    return priceB - priceA;
                });
            } else if (sortType === 'newest') {
                sortedItems.reverse(); // Simplified newest
            }

            displayProducts(sortedItems);
            setTimeout(closeAllDrawers, 300); // Smooth close after selection
        });
    });

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
